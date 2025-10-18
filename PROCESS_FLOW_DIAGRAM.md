# 📱 H5 Airtime App - Process Flow Diagrams

## 🔄 V1 Process Flow (Original UI)

### Complete V1 User Journey

```mermaid
graph TD
    A[PhoneInput /] --> B{Topup Type?}
    B -->|For Myself| D[BundleSelection /bundles]
    B -->|For Someone Else| C[RecipientInput /recipient]
    C --> D
    D --> E[PaymentFlow /payment]
    E --> F[Confirmation /confirmation]
    F -->|Send Another| A
    F -->|Print Receipt| G[Print Receipt]
    
    style A fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style C fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style D fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style E fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style F fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style G fill:#f3e8ff,stroke:#662d91,stroke-width:2px
```

### V1 State Management Flow

```mermaid
graph LR
    A[phoneData] --> B[topUpType]
    B --> C[recipientData]
    C --> D[selectedBundle]
    D --> E[paymentData]
    E --> F[confirmation]
    
    style A fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style B fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style C fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style D fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style E fill:#f3e8ff,stroke:#662d91,stroke-width:2px
    style F fill:#f3e8ff,stroke:#662d91,stroke-width:2px
```

---


## 🔀 UI Version Switching Flow

### Version Switcher Logic

```mermaid
graph TD
    A[UI Version Switcher] --> B{Current Version?}
    B -->|V1 Active| C[Switch to V2]
    B -->|V2 Active| D[Switch to V1]
    
    C --> E[Route Mapping V1→V2]
    D --> F[Route Mapping V2→V1]
    
    E --> G[Preserve State]
    F --> G
    
    G --> H[Update UI]
    
    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style E fill:#f0fff0,stroke:#90EE90,stroke-width:2px
    style F fill:#e1d5f7,stroke:#662d91,stroke-width:2px
```

### Route Mapping Diagram

```mermaid
graph LR
    subgraph V1["V1 Routes (Original)"]
        A1["/"]
        A2["/recipient"]
        A3["/bundles"]
        A4["/payment"]
        A5["/confirmation"]
    end
    
    subgraph V2["V2 Routes (SuperApp)"]
        B1["/v2"]
        B2["/v2/bundles"]
        B3["/v2/payment"]
        B4["/v2/success"]
    end
    
    A1 -.->|Switch| B1
    A2 -.->|Switch| B2
    A3 -.->|Switch| B2
    A4 -.->|Switch| B3
    A5 -.->|Switch| B4
    
    B1 -.->|Switch| A1
    B2 -.->|Switch| A3
    B3 -.->|Switch| A4
    B4 -.->|Switch| A5
    
    style V1 fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style V2 fill:#f0fff0,stroke:#90EE90,stroke-width:2px
```

---

## 📊 Data Flow Architecture

### State Management Flow

```mermaid
graph TD
    A[App.jsx Main State] --> B[phoneData]
    A --> C[topUpType]
    A --> D[selectedBundle]
    A --> E[paymentData]
    
    B --> F[PhoneInput Components]
    C --> G[Topup Type Logic]
    D --> H[Bundle Selection Components]
    E --> I[Payment Components]
    
    F --> J[V1 PhoneInput]
    F --> K[V2 PhoneInputV2]
    
    H --> L[V1 BundleSelection]
    H --> M[V2 BundleSelectionV2]
    
    I --> N[V1 PaymentFlow]
    I --> O[V2 PaymentV2]
    
    style A fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style B fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style C fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style D fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style E fill:#e1d5f7,stroke:#662d91,stroke-width:2px
```

---

## 🔧 Technical Architecture

### Component Hierarchy

```mermaid
graph TD
    A[App.jsx] --> B[Router]
    B --> C[UIVersionSwitcher]
    B --> D[V1 Routes]
    B --> E[V2 Routes]
    
    D --> F[PhoneInput]
    D --> G[RecipientInput]
    D --> H[BundleSelection]
    D --> I[PaymentFlow]
    D --> J[Confirmation]
    
    E --> K[AppV2]
    K --> L[PhoneInputV2]
    K --> M[BundleSelectionV2]
    K --> N[PaymentV2]
    K --> O[SuccessV2]
    
    style A fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style D fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style E fill:#f0fff0,stroke:#90EE90,stroke-width:2px
```

### Payment Processing Flow

```mermaid
graph TD
    A[User Selects Bundle] --> B[Payment Method Selection]
    B --> C[Card Details Input]
    C --> D[Validation]
    D --> E{Valid?}
    E -->|Yes| F[SuperApp SDK Call]
    E -->|No| G[Show Error]
    G --> C
    
    F --> H[Payment Processing]
    H --> I{Success?}
    I -->|Yes| J[Update State]
    I -->|No| K[Payment Error]
    
    J --> L[Navigate to Confirmation]
    K --> M[Retry Option]
    M --> C
    
    style A fill:#e1d5f7,stroke:#662d91,stroke-width:2px
    style F fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style J fill:#f0fff0,stroke:#90EE90,stroke-width:2px
    style K fill:#fef2f2,stroke:#ef4444,stroke-width:2px
```

---

## 📱 Mobile User Experience Flow

### Touch Interaction Flow

```mermaid
graph TD
    A[User Opens App] --> B[Select UI Version]
    B --> C[Enter Phone Number]
    C --> D[Select Topup Type]
    D --> E[Choose Bundle]
    E --> F[Enter Payment Details]
    F --> G[Process Payment]
    G --> H[View Confirmation]
    H --> I{Continue?}
    I -->|Yes| J[New Topup]
    I -->|No| K[Close App]
    
    J --> C
    
    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style G fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style H fill:#f0fff0,stroke:#90EE90,stroke-width:2px
```

---

## 🔒 Security & Validation Flow

### Input Validation Process

```mermaid
graph TD
    A[User Input] --> B[Real-time Validation]
    B --> C{Valid Format?}
    C -->|Yes| D[Business Logic Check]
    C -->|No| E[Show Error Message]
    
    D --> F{Business Rules OK?}
    F -->|Yes| G[Enable Continue Button]
    F -->|No| H[Show Business Error]
    
    E --> I[User Corrects Input]
    H --> I
    I --> B
    
    G --> J[Proceed to Next Step]
    
    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style G fill:#f0fff0,stroke:#90EE90,stroke-width:2px
    style E fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style H fill:#fef2f2,stroke:#ef4444,stroke-width:2px
```

---

## 🎯 Success Metrics Flow

### Performance Tracking

```mermaid
graph LR
    A[User Starts Flow] --> B[Step 1 Completion]
    B --> C[Step 2 Completion]
    C --> D[Step 3 Completion]
    D --> E[Payment Success]
    E --> F[Transaction Complete]
    
    B --> G[Step 1 Metrics]
    C --> H[Step 2 Metrics]
    D --> I[Step 3 Metrics]
    E --> J[Payment Metrics]
    F --> K[Success Metrics]
    
    style A fill:#e0f2fe,stroke:#0284c7,stroke-width:2px
    style E fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style F fill:#f0fff0,stroke:#90EE90,stroke-width:2px
```

---

## 📋 Error Handling Flow

### Error Recovery Process

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    B -->|Validation Error| C[Show Input Error]
    B -->|Payment Error| D[Show Payment Error]
    B -->|Network Error| E[Show Network Error]
    B -->|System Error| F[Show System Error]
    
    C --> G[User Corrects Input]
    D --> H[Retry Payment]
    E --> I[Check Connection]
    F --> J[Contact Support]
    
    G --> K[Continue Flow]
    H --> L[Payment Processing]
    I --> M[Retry Request]
    J --> N[End Session]
    
    L --> O{Success?}
    O -->|Yes| K
    O -->|No| D
    
    M --> P{Success?}
    P -->|Yes| K
    P -->|No| E
    
    style A fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style K fill:#f0fff0,stroke:#90EE90,stroke-width:2px
    style N fill:#f3f4f6,stroke:#6b7280,stroke-width:2px
```

---

**These diagrams provide a comprehensive visual representation of the H5 Airtime app's process flows, architecture, and user journeys for both V1 and V2 interfaces.**
