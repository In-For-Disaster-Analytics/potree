# LiDAR Visualization Pipeline - Phase Documentation

## Pipeline Overview

This streamlined LiDAR processing pipeline transforms raw point cloud data into web-accessible visualizations through five key phases. The pipeline emphasizes automated processing, direct web accessibility, and efficient resource management within existing infrastructure.

---

## Phase 1: Processing Submission & Conversion

**Objective**: Convert raw LAS files into web-optimized point cloud formats using Tapis platform orchestration.

```mermaid
sequenceDiagram
    participant User as 👤 User/Researcher
    participant Tapis as ⚙️ Tapis Platform
    participant Potree as 🔧 Potree Converter
    participant Corral as 💾 Corral Storage
    participant Target as 🌐 Target Web Server
    participant CKAN as 📚 CKAN Portal
    participant Browser as 🌍 Browser/Client

    Note over User,Browser: LiDAR Data Processing & Deployment Pipeline

    %% Processing Submission
    rect rgb(240, 248, 255)
        Note over User,Potree: Phase 1: Processing Submission & Conversion
        User->>Tapis: Submit  Potree Converter Cookbook
        Note right of User: Parameters:<br/>- Input: LAS file path<br/>- Output: web directory<br/>- Converter settings

        Tapis->>Corral: Read LAS files
        Corral-->>Tapis: Return LAS data

        Tapis->>Potree: Execute conversion job
        Note right of Potree: Potree Converter v2.1.1<br/>Processing steps:<br/>1. Parse LAS structure<br/>2. Build spatial octree<br/>3. Generate web tiles<br/>4. Create JSON5 config

        Potree->>Potree: Process point cloud data
        loop Generate LOD levels
            Potree->>Potree: Create octree hierarchy
            Potree->>Potree: Generate web-optimized tiles
        end

        Potree->>Corral: Write processed files
        Note right of Corral: Generated files:<br/>- cloud.js (octree)<br/>- hierarchy.bin<br/>- *.bin (point data)<br/>- potree_config.json5<br/>- metadata.json


        Corral->>Corral: Move data to web accessible folder
        Note right of Corral: The files must be accessible

        Potree-->>Tapis: Job completion status
        Tapis-->>User: Processing complete notification
    end

```

### Key Activities

#### Job Submission

- **User Action**: Submit Potree Converter Cookbook to Tapis platform
- **Parameters Specified**:
  - Input LAS file path in Corral storage
  - Output web directory location
  - Converter settings and optimization parameters

#### Data Processing Workflow

```
Tapis Platform → Read LAS files from Corral Storage
Tapis Platform → Execute Potree Converter v2.1.1
Potree Converter → Process point cloud data through multiple steps:
    1. Parse LAS structure and metadata
    2. Build spatial octree hierarchy
    3. Generate web-optimized tiles
    4. Create JSON5 configuration file
```

#### Iterative Processing

- **Level of Detail Generation**: Creates multiple resolution levels for adaptive rendering
- **Octree Hierarchy**: Builds spatial data structure for efficient visualization
- **Web Optimization**: Generates tiles optimized for browser-based streaming

#### Output Generation

**Generated Files**:

- `cloud.js` - Main octree structure file
- `hierarchy.bin` - Spatial hierarchy data
- `*.bin` files - Point data at various detail levels
- `potree_config.json5` - Visualization configuration
- `metadata.json` - Processing and spatial metadata

#### Critical Infrastructure Step

- **Data Accessibility**: Files moved to web-accessible folder within Corral
- **Direct Access**: Ensures processed data can be served directly without additional transfers
- **Performance Optimization**: Eliminates need for external data movement

### Outcomes

- Raw LAS data transformed into web-ready format
- All files accessible via web URLs
- Processing completion notification sent to user
- Data ready for immediate cataloging and visualization

---

## Phase 2: CKAN Registration & Cataloging

**Objective**: Register processed point cloud data as discoverable resources in the CKAN data portal.

```mermaid
sequenceDiagram
    participant User as 👤 User/Researcher
    participant Tapis as ⚙️ Tapis Platform
    participant Potree as 🔧 Potree Converter
    participant Corral as 💾 Corral Storage
    participant Target as 🌐 Target Web Server
    participant CKAN as 📚 CKAN Portal
    participant Browser as 🌍 Browser/Client

    %% CKAN Registration Phase
    rect rgb(248, 240, 255)
        Note over User,CKAN: Phase 2: CKAN Registration & Cataloging
        User->>CKAN: Register resource
        Note right of User: Parameters info:<br/>- JSON5 file

        User->>CKAN: Upload Potree JSON5 file
        Note right of CKAN: CKAN recognizes<br/>Potree file type

        CKAN->>CKAN: Extract metadata from JSON5 [FUTURE]
        Note right of CKAN: Auto-extracted:<br/>- Bounding box<br/>- Classification types<br/>- Coordinate system<br/>- View parameters

        CKAN->>CKAN: Create resource entry with target URLs
        Note right of CKAN: Catalog entry:<br/>- Discoverable metadata<br/>- Links to deployed visualization<br/>- Resource descriptions
    end

```

### Key Activities

#### Resource Registration

- **User Action**: Register new resource in CKAN portal
- **Primary Asset**: Upload Potree JSON5 configuration file
- **Resource Type**: CKAN recognizes and categorizes as Potree visualization

#### CKAN File Type Recognition

- **Automatic Detection**: CKAN identifies JSON5 as Potree configuration
- **Specialized Handling**: Applies appropriate metadata extraction and preview capabilities
- **Resource Classification**: Categorizes for specialized search and discovery

#### Metadata Extraction (Future Enhancement)

**Planned Auto-extraction from JSON5**:

- **Spatial Bounds**: Geographic bounding box coordinates
- **Classification Schema**: Point cloud classification types and colors
- **Coordinate System**: Spatial reference system information
- **View Parameters**: Default camera positions and rendering settings

#### Catalog Entry Creation

**Generated Catalog Information**:

- **Discoverable Metadata**: Searchable dataset description and keywords
- **Direct Visualization Links**: URLs pointing to web-accessible files
- **Resource Descriptions**: Technical details and usage information
- **Access Information**: Direct links to visualization interface

### Outcomes

- Point cloud data becomes discoverable through CKAN search
- Standardized metadata enables efficient filtering and discovery
- Direct links established to visualization resources
- Foundation for collaborative data sharing

---

## Phase 3: Discovery & Access

**Objective**: Enable users to find, evaluate, and access point cloud visualizations through the CKAN portal.

```mermaid
sequenceDiagram
    participant User as 👤 User/Researcher
    participant Tapis as ⚙️ Tapis Platform
    participant Potree as 🔧 Potree Converter
    participant Corral as 💾 Corral Storage
    participant Target as 🌐 Target Web Server
    participant CKAN as 📚 CKAN Portal
    participant Browser as 🌍 Browser/Client

    %% Discovery & Access Phase
    rect rgb(255, 248, 240)
        Note over User,Browser: Phase 3: Discovery & Access
        User->>CKAN: Search for point clouds
        Note right of User: Search criteria:<br/>- Geographic region<br/>- Classification types<br/>- Date range<br/>- Keywords

        CKAN-->>User: Return search results
        Note left of CKAN: Results include:<br/>- Dataset previews<br/>- Metadata summary<br/>- Direct visualization links

        User->>CKAN: Select dataset and resource
        CKAN-->>User: Provide target visualization URL
        Note left of CKAN: URL points to deployed<br/>visualization on target server<br> Pass JSON5 as query parameters

        User->>Target: Access visualization URL
        Target->>Browser: Serve Potree viewer with local data
        Note right of Browser: No streaming from<br/>processing infrastructure
    end
```

### Key Activities

#### Data Discovery

- **Search Interface**: Users query CKAN using multiple criteria
- **Search Parameters**:
  - Geographic region and spatial extent
  - Classification types (vegetation, buildings, ground, etc.)
  - Date ranges and collection periods
  - Keywords and descriptive terms

#### Search Results Presentation

**CKAN Returns**:

- **Dataset Previews**: Thumbnail images or summary visualizations
- **Metadata Summary**: Key dataset characteristics and parameters
- **Direct Visualization Links**: One-click access to interactive viewers

#### Dataset Selection & Access

- **Resource Selection**: User chooses specific dataset and resource
- **URL Generation**: CKAN provides target visualization URL
- **Parameter Passing**: JSON5 configuration passed as query parameters
- **Seamless Transition**: Direct routing to visualization interface

#### Technical Implementation

- **Target Server Access**: URLs point to web-accessible Corral locations
- **No Processing Infrastructure Load**: Eliminates streaming from TACC processing systems
- **Optimized Performance**: Direct file serving for improved user experience

### Outcomes

- Efficient discovery of relevant point cloud datasets
- Immediate access to interactive visualizations
- Reduced load on processing infrastructure
- Streamlined user workflow from search to visualization

---

## Phase 4: Local Visualization

**Objective**: Provide interactive 3D point cloud visualization with full analysis capabilities.

```mermaid
sequenceDiagram
    participant User as 👤 User/Researcher
    participant Tapis as ⚙️ Tapis Platform
    participant Potree as 🔧 Potree Converter
    participant Corral as 💾 Corral Storage
    participant Target as 🌐 Target Web Server
    participant CKAN as 📚 CKAN Portal
    participant Browser as 🌍 Browser/Client

    %% Visualization Phase
    rect rgb(240, 255, 240)
        Note over Browser,Target: Phase 4: Local Visualization
        Browser->>Target: Load Potree viewer application
        Target-->>Browser: Return viewer files

        Browser->>Target: Load JSON5 configuration
        Target-->>Browser: Return local config

        Browser->>Target: Request point cloud data
        Note right of Browser: Adaptive loading<br/>based on view level

        Target-->>Browser: Stream octree tiles locally
        Browser->>Browser: Render 3D visualization

        Note over Browser: Interactive features:<br/>- 3D navigation<br/>- Measurement tools<br/>- Classification filters<br/>- Export options
    end
```

### Key Activities

#### Viewer Application Loading

- **Potree Viewer Delivery**: Target server serves complete visualization application
- **Local Data Access**: All point cloud data served from same infrastructure
- **Configuration Loading**: JSON5 settings applied to viewer initialization by query parameters (https://<target-server>/potree/viewer.html?config=<config.json5>)

#### Data Streaming & Rendering

```
Browser → Read the JSON5 configuration
Browser -> Request point cloud data from Target Server
Target Server → Stream octree tiles based on view level
Browser → Adaptive loading based on user navigation
Browser → Real-time 3D rendering and visualization
```

#### Interactive Capabilities

**Available Features**:

- **3D Navigation**: Pan, zoom, rotate with multiple camera modes
- **Measurement Tools**: Distance, area, volume, and height calculations
- **Export Options**: Screenshot capture and data subset downloads

#### Performance Optimization

- **Level of Detail**: Automatic resolution adjustment based on view distance
- **Adaptive Loading**: Loads only visible point cloud sections
- **Local Processing**: All rendering performed client-side for responsiveness
- **GPU Acceleration**: Utilizes WebGL for smooth interaction

### Outcomes

- High-performance 3D point cloud visualization
- Complete analysis toolkit for scientific research
- No software installation requirements

---

## Phase 5: Collaboration & Sharing

**Objective**: Enable persistent data analysis, team collaboration, and long-term data sharing.

```mermaid
sequenceDiagram
    participant User as 👤 User/Researcher
    participant Tapis as ⚙️ Tapis Platform
    participant Potree as 🔧 Potree Converter
    participant Corral as 💾 Corral Storage
    participant Target as 🌐 Target Web Server
    participant CKAN as 📚 CKAN Portal
    participant Browser as 🌍 Browser/Client

    %% Collaboration & Sharing
    rect rgb(255, 240, 245)
        Note over User,Target: Phase 5: Collaboration & Sharing
        User->>Browser: Create annotations/measurements
        Browser->>Target: Save user data
        Note right of Target: Persistent state:<br/>- Annotations<br/>- Measurements<br/>- View bookmarks
        User-->>Browser: Download JSON5
        Browser-->>User: Provide JSON5 file
        User->>CKAN: Upload JSON5 to CKAN (Create or replace?)
        Note right of User: Permanent link for<br/>collaboration & citation<br/>Points to target server
        CKAN-->>User: Provide the sharable link. Url format: https://target-server/potree/viewer.html?config=<config.json5>
        User->>User: Collaborate with team
        Note left of User: Shared access via<br/>stable target URLs
    end
```

### Key Activities

#### User Interaction & Analysis

- **Annotation Creation**: Users add spatial annotations and descriptive labels
- **Measurement Recording**: Precise measurements saved with project context
- **Analysis Documentation**: Research findings documented within visualization

#### Data Persistence

**Saved Information**:

- **Annotations**: Spatial markers with descriptive text
- **Measurements**: Quantitative analysis results
- **View Bookmarks**: Saved camera positions and visualization states
- **Analysis Sessions**: Complete workflow documentation

#### Collaboration Features

- **Team Access**: Shared visualization URLs for collaborative analysis
- **Version Control**: Consistent access to specific dataset versions
- **Cross-Platform Sharing**: URLs work across different devices and browsers

### Outcomes

- Persistent research analysis capabilities
- Effective team collaboration tools
- Reliable sharing

---

## Technical Architecture Benefits

### Infrastructure Efficiency

- **Separated Concerns**: Processing and serving infrastructure optimized independently
- **Scalable Deployment**: Multiple target servers can host the same datasets
- **Cost Optimization**: Efficient resource utilization across pipeline stages

### User Experience

- **Fast Access**: Local data serving provides optimal performance
- **Reliable URLs**: Stable links for bookmarking and sharing
- **No Dependencies**: Browser-based access without software installation
- **Cross-Platform**: Consistent experience across devices and operating systems

### Data Management

- **FAIR Compliance**: Findable, Accessible, Interoperable, Reusable data
- **Standardized Formats**: JSON5 configuration enables consistent metadata
- **Automated Workflows**: Minimal manual intervention required
- **Quality Control**: Validation and verification throughout pipeline

### Research Impact

- **Enhanced Discovery**: Rich metadata enables precise dataset finding
- **Collaborative Analysis**: Shared URLs facilitate team research
- **Educational Value**: Accessible visualizations support teaching and outreach
