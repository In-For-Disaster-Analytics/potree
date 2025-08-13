# Potree Query Parameter Configuration Support

This implementation adds query parameter support to Potree viewer, enabling seamless integration with CKAN and other data portals. This addresses [GitHub Issue #5](https://github.com/mosoriob/potree/issues/5).

## 🚀 Quick Start

### Basic Usage
```
query_config_viewer.html?scene=path/to/config.json5
```

### CKAN Integration Example
```
https://your-server.com/potree/query_config_viewer.html?scene=https://ckan.example.org/dataset/resource/config.json5
```

## 📁 Files Added

- **`query_config_viewer.html`** - Main viewer with query parameter support
- **`resources/test_config.json5`** - Sample JSON5 configuration for testing
- **`test_query_params.html`** - Test interface with example links
- **`README_query_config.md`** - This documentation file

## ⚡ Features

### Core Functionality
- ✅ **Query Parameter Parsing** - Parse `?scene=`, `?pointcloud=`, `?debug=` parameters
- ✅ **JSON5 Support** - Load configurations with comments and relaxed syntax  
- ✅ **Project Loading** - Full integration with Potree's `loadProject()` method
- ✅ **Error Handling** - Comprehensive error reporting with user-friendly messages
- ✅ **Security** - Same-origin policy enforcement for external URLs

### User Experience
- ✅ **Loading Indicators** - Visual feedback during configuration loading
- ✅ **Error Messages** - Clear error descriptions with troubleshooting options
- ✅ **Retry Mechanisms** - Allow users to retry failed loads
- ✅ **Fallback Options** - Load default view when configuration fails
- ✅ **Debug Mode** - Console logging for development and troubleshooting

### Integration Features  
- ✅ **GitHub Integration** - Direct issue reporting from error screens
- ✅ **CKAN Ready** - Designed for data portal integration
- ✅ **Backward Compatible** - Works with existing Potree configurations
- ✅ **Documentation** - Complete usage examples and test cases

## 🔧 Configuration Format

The viewer supports standard Potree JSON/JSON5 project files with the following structure:

```json5
{
  "type": "Potree",
  "version": 1.7,
  "settings": {
    "pointBudget": 1000000,
    "fov": 60,
    "edlEnabled": true,
    "background": "gradient"
    // JSON5 allows comments!
  },
  "view": {
    "position": [x, y, z],
    "target": [x, y, z]
  },
  "pointclouds": [
    {
      "name": "Point Cloud Name",
      "url": "path/to/cloud.js",
      "position": [x, y, z],
      "rotation": [x, y, z, "XYZ"],
      "scale": [x, y, z]
    }
  ],
  "annotations": [...],
  "measurements": [...],
  "classifications": {...}
}
```

## 🌐 URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `scene` | Path to JSON/JSON5 configuration file | `?scene=./config.json5` |
| `pointcloud` | Direct point cloud loading (legacy) | `?pointcloud=../cloud.js` |
| `debug` | Enable debug console logging | `?debug=true` |

## 🧪 Testing

### Manual Testing
1. Open `test_query_params.html` in your browser
2. Click on the test links to verify functionality
3. Check browser console for debug output when `debug=true`

### Test Cases Included
1. **JSON5 Configuration** - Test with comments and annotations
2. **JSON Configuration** - Test with existing Sorvilier project
3. **Direct Point Cloud** - Legacy single point cloud loading
4. **Error Handling** - Test with invalid configuration URL
5. **Info Mode** - Test without parameters

### Expected Results
- ✅ Configurations load successfully
- ✅ Point clouds render correctly
- ✅ Annotations and measurements appear
- ✅ Error messages display for invalid URLs
- ✅ Loading indicators show during fetch operations

## 🔒 Security Considerations

### Same-Origin Policy
- External URLs are only allowed from the same origin as the viewer
- This prevents loading arbitrary configurations from untrusted sources
- CORS policies must be properly configured for cross-origin requests

### URL Validation
- Only `.json` and `.json5` file extensions are allowed
- URLs are validated before processing
- Invalid formats trigger user-friendly error messages

## 🔗 CKAN Integration

### Setup Steps
1. Deploy `query_config_viewer.html` to your web server
2. Configure CKAN to generate configuration URLs
3. Set up proper CORS headers if needed
4. Test with the URL format:
   ```
   https://your-potree-server.com/query_config_viewer.html?scene=https://your-ckan.org/dataset/123/resource/456/download/config.json5
   ```

### CKAN Resource Configuration
```json5
{
  // CKAN metadata can be included as comments
  "type": "Potree",
  "version": 1.7,
  "pointclouds": [{
    "name": "Dataset from CKAN",
    "url": "https://your-ckan.org/dataset/123/resource/789/download/cloud.js"
  }]
}
```

## 🐛 Error Handling

### Error Types Handled
- **Network Errors** - Connection failures, timeouts, CORS issues
- **Format Errors** - Invalid JSON/JSON5 syntax
- **Validation Errors** - Missing required fields, invalid structure
- **Security Errors** - Blocked external URLs
- **Loading Errors** - Failed point cloud or resource loading

### Error UI Features
- Clear error messages with technical details
- Retry buttons for temporary failures
- Default view fallback option
- GitHub issue reporting integration
- Copy-paste error details for support

## 📈 Performance

### Optimizations
- Async/await for non-blocking configuration loading
- Progressive loading with visual feedback
- Error recovery without page reload
- Minimal resource overhead

### Monitoring
- Debug mode provides timing information
- Console logs track loading progress
- Error details include performance metrics

## 🔄 Backward Compatibility

The implementation maintains full backward compatibility:
- Existing Potree viewers continue to work unchanged
- Standard `loadProject()` functionality preserved
- All existing configuration formats supported
- No breaking changes to core Potree APIs

## 📖 Development

### Adding New Features
1. Modify `query_config_viewer.html`
2. Update test cases in `test_query_params.html`
3. Add new configuration examples
4. Update this documentation

### Debugging
- Use `?debug=true` parameter for console output
- Check browser Network tab for fetch operations
- Verify JSON5 parsing with browser console
- Test error scenarios with invalid URLs

## 🎯 Next Steps

### Potential Enhancements
- [ ] Support for multiple configuration formats
- [ ] Configuration validation service
- [ ] Real-time configuration updates
- [ ] Configuration preview without full load
- [ ] Integration with more data portals

### Production Deployment
1. Test thoroughly with your specific configurations
2. Set up proper CORS headers
3. Configure HTTPS for secure external loading
4. Monitor error rates and user feedback
5. Consider CDN deployment for performance

---

## 📞 Support

For issues and questions:
- Create GitHub issues at: https://github.com/mosoriob/potree/issues
- Use the built-in error reporting feature
- Include configuration URLs and browser information
- Check console logs for detailed error information

**Implementation Status: ✅ Complete and Ready for Production**