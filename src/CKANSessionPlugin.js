/**
 * CKAN Session Management Plugin for Potree Viewer
 *
 * Enables workspace persistence through CKAN API integration
 * Allows users to save, load, and share complete analysis sessions
 */

import { EventDispatcher } from './EventDispatcher.js';
import { saveProject } from './viewer/SaveProject.js';
import { loadProject } from './viewer/LoadProject.js';
import { Utils } from './utils.js';

export class CKANSessionPlugin extends EventDispatcher {
  constructor(viewer, options = {}) {
    super();

    this.viewer = viewer;
    this.ckanBaseUrl = options.ckanBaseUrl;
    this.clientId = options.clientId;
    this.autoSave = options.autoSave || false;
    this.saveInterval = options.saveInterval || 300000; // 5 minutes
    this.authenticationRequired = options.authenticationRequired !== false;

    this.accessToken = null;
    this.refreshToken = null;
    this.currentWorkspace = null;
    this.autoSaveTimer = null;

    // Configuration callbacks
    this.onSave = options.onSave || (() => {});
    this.onLoad = options.onLoad || (() => {});
    this.onError =
      options.onError ||
      ((error) => console.error('CKAN Session Error:', error));
    this.onAuthRequired =
      options.onAuthRequired || (() => console.log('Authentication required'));
    this.onAuthSuccess =
      options.onAuthSuccess ||
      ((user) => console.log('Authenticated as:', user.name));

    this.init();
  }

  async init() {
    // Check for workspace URL parameters on initialization
    await this.loadWorkspaceFromURL();

    // Setup auto-save if enabled
    if (this.autoSave) {
      this.setupAutoSave();
    }
  }

  /**
   * Check current authentication status with CKAN
   */
  async checkSession() {
    if (!this.ckanBaseUrl) {
      throw new Error('CKAN base URL not configured');
    }

    try {
      const response = await fetch(
        `${this.ckanBaseUrl}/api/action/status_show`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        return {
          authenticated: data.result.user_logged_in || false,
          user: data.result.user || null,
          token: data.result.oauth_token || null,
        };
      } else {
        return { authenticated: false, user: null, token: null };
      }
    } catch (error) {
      this.onError(error);
      return { authenticated: false, user: null, token: null };
    }
  }

  /**
   * Authenticate with CKAN using OAuth
   */
  async authenticate() {
    try {
      const sessionInfo = await this.checkSession();

      if (sessionInfo.authenticated) {
        this.accessToken = sessionInfo.token;
        this.onAuthSuccess(sessionInfo.user);
        return true;
      }

      if (this.authenticationRequired) {
        this.onAuthRequired();
        return this.initiateOAuthFlow();
      }

      return false;
    } catch (error) {
      this.onError(error);
      return false;
    }
  }

  /**
   * Initiate OAuth authentication flow
   */
  initiateOAuthFlow() {
    if (!this.clientId) {
      throw new Error('OAuth client ID not configured');
    }

    const redirectUri = encodeURIComponent(
      window.location.origin + window.location.pathname,
    );
    const authUrl = `${this.ckanBaseUrl}/oauth/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${redirectUri}`;

    window.location.href = authUrl;
    return false; // Will redirect, so return false for now
  }

  /**
   * Serialize current workspace state
   */
  serializeWorkspace() {
    return saveProject(this.viewer);
  }

  /**
   * Deserialize and load workspace state
   */
  async deserializeWorkspace(workspaceData) {
    try {
      await loadProject(this.viewer, workspaceData);
      this.currentWorkspace = workspaceData;
      this.dispatchEvent({ type: 'workspaceLoaded', workspace: workspaceData });
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Save workspace to CKAN
   */
  async saveWorkspace(workspaceMetadata = {}) {
    if (!this.ckanBaseUrl) {
      throw new Error('CKAN base URL not configured');
    }

    try {
      // Ensure authentication
      const isAuthenticated = await this.authenticate();
      if (!isAuthenticated && this.authenticationRequired) {
        throw new Error('Authentication required to save workspace');
      }

      // Serialize current workspace
      const workspaceData = this.serializeWorkspace();

      // Prepare workspace file
      const filename = `workspace_${Date.now()}.json`;
      const fileBlob = new Blob([JSON.stringify(workspaceData, null, 2)], {
        type: 'application/json',
      });

      // Prepare form data
      const formData = new FormData();
      formData.append(
        'package_id',
        workspaceMetadata.packageId || 'default-workspace-package',
      );
      formData.append('name', workspaceMetadata.title || 'Potree Workspace');
      formData.append(
        'description',
        workspaceMetadata.description || 'Potree viewer workspace session',
      );
      formData.append('format', 'potree-workspace');
      formData.append('resource_type', 'workspace');
      formData.append('upload', fileBlob, filename);

      // Add simple metadata counts
      if (workspaceData.annotations) {
        formData.append(
          'annotation_count',
          workspaceData.annotations.length.toString(),
        );
      }
      if (workspaceData.measurements) {
        formData.append(
          'measurement_count',
          workspaceData.measurements.length.toString(),
        );
      }

      // Make API request
      const headers = {
        ...(this.accessToken && {
          Authorization: `Bearer ${this.accessToken}`,
        }),
      };

      const response = await fetch(
        `${this.ckanBaseUrl}/api/action/resource_create`,
        {
          method: 'POST',
          credentials: 'include',
          headers: headers,
          body: formData,
        },
      );

      const result = await response.json();

      if (result.success) {
        this.currentWorkspace = {
          ...workspaceData,
          _metadata: result.result,
        };

        this.onSave(this.currentWorkspace);
        this.dispatchEvent({
          type: 'workspaceSaved',
          workspace: this.currentWorkspace,
        });

        return result.result;
      } else {
        throw new Error(result.error.message || 'Failed to save workspace');
      }
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Load workspace from CKAN by resource ID
   */
  async fetchWorkspace(resourceId) {
    if (!this.ckanBaseUrl) {
      throw new Error('CKAN base URL not configured');
    }

    try {
      // Get resource metadata
      const resourceResponse = await fetch(
        `${this.ckanBaseUrl}/api/action/resource_show?id=${resourceId}`,
        { credentials: 'include' },
      );

      const resourceData = await resourceResponse.json();

      if (!resourceData.success) {
        throw new Error(
          resourceData.error.message || 'Failed to fetch resource metadata',
        );
      }

      // Download workspace file
      const fileResponse = await fetch(resourceData.result.url, {
        credentials: 'include',
      });

      if (!fileResponse.ok) {
        throw new Error(
          `Failed to download workspace file: ${fileResponse.statusText}`,
        );
      }

      const workspaceData = await fileResponse.json();

      // Load the workspace
      await this.deserializeWorkspace(workspaceData);

      this.onLoad(workspaceData);

      return {
        metadata: resourceData.result,
        workspace: workspaceData,
      };
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Load workspace from direct URL
   */
  async fetchWorkspaceFromURL(workspaceUrl) {
    try {
      const response = await fetch(workspaceUrl, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch workspace from URL: ${response.statusText}`,
        );
      }

      const workspaceData = await response.json();
      await this.deserializeWorkspace(workspaceData);

      this.onLoad(workspaceData);

      return workspaceData;
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }

  /**
   * Load workspace based on URL parameters
   */
  async loadWorkspaceFromURL() {
    try {
      const workspaceId = Utils.getParameterByName('workspace');
      const workspaceUrl = Utils.getParameterByName('workspace_url');

      if (workspaceId) {
        await this.fetchWorkspace(workspaceId);
      } else if (workspaceUrl) {
        await this.fetchWorkspaceFromURL(workspaceUrl);
      }
    } catch (error) {
      this.onError(error);
    }
  }

  /**
   * Generate shareable URL for workspace
   */
  generateShareURL(resourceId, baseUrl = null) {
    const url = new URL(baseUrl || window.location.href);
    url.searchParams.set('workspace', resourceId);
    return url.toString();
  }

  /**
   * Setup automatic workspace saving
   */
  setupAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(async () => {
      try {
        if (this.currentWorkspace) {
          await this.saveWorkspace({
            title: 'Auto-saved Workspace',
            description: 'Automatically saved workspace session',
          });
        }
      } catch (error) {
        // Silent fail for auto-save, just log
        console.warn('Auto-save failed:', error);
      }
    }, this.saveInterval);
  }

  /**
   * Cleanup and destroy plugin
   */
  destroy() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    this.removeAllEventListeners();
  }
}

/**
 * Initialize CKAN Session Plugin
 * @param {Object} viewer - Potree viewer instance
 * @param {Object} options - Plugin configuration options
 * @returns {CKANSessionPlugin} Plugin instance
 */
export function initCKANSessionPlugin(viewer, options = {}) {
  return new CKANSessionPlugin(viewer, options);
}
