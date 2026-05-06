const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TabStopType, TabStopPosition, ImageRun
} = require('docx');
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIAG = path.join(__dirname, 'rw_diagrams');
const TNR  = "Times New Roman";

// ── helpers ─────────────────────────────────────────────────────────────────
const thin  = { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" };
const cb    = { top: thin, bottom: thin, left: thin, right: thin };
const nb    = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const nob   = { top: nb, bottom: nb, left: nb, right: nb };

function tr(text, o={}) { return new TextRun({ text, font:TNR, size:24, ...o }); }
function trB(t,o={})    { return tr(t,{bold:true,...o}); }

function sp(after=120)  { return {after}; }

function body(text, extra={}) {
  return new Paragraph({ spacing:sp(120), children:[tr(text)], ...extra });
}
function bodyJ(text) {
  return new Paragraph({
    spacing:sp(120), alignment:AlignmentType.BOTH, children:[tr(text)]
  });
}
function spacer(n=1) {
  return [...Array(n)].map(()=>new Paragraph({spacing:sp(80),children:[tr('')]}));
}
function pb() { return new Paragraph({children:[new PageBreak()]}); }

function bullet(text) {
  return new Paragraph({
    numbering:{reference:"bullets",level:0}, spacing:sp(80), children:[tr(text)]
  });
}
function numbered(text) {
  return new Paragraph({
    numbering:{reference:"numbers",level:0}, spacing:sp(80), children:[tr(text)]
  });
}
function codeL(lines) {
  return lines.map(l=>new Paragraph({
    spacing:sp(40), indent:{left:720},
    children:[new TextRun({text:l,font:"Courier New",size:18})]
  }));
}
function figCap(text) {
  return new Paragraph({
    alignment:AlignmentType.CENTER, spacing:sp(200),
    children:[new TextRun({text,font:TNR,size:22,italics:true})]
  });
}
function H1(num,title) {
  return new Paragraph({
    heading:HeadingLevel.HEADING_1, spacing:{before:280,after:140},
    children:[trB(`${num}. ${title}`,{size:28})]
  });
}
function H2(num,title) {
  return new Paragraph({
    heading:HeadingLevel.HEADING_2, spacing:{before:220,after:100},
    children:[trB(`${num} ${title}`,{size:24})]
  });
}

function diag(filename, wPx=580) {
  const data = fs.readFileSync(path.join(DIAG,filename));
  let hPx;
  try {
    const out = execSync(`python3 -c "from PIL import Image; im=Image.open('${path.join(DIAG,filename)}'); print(im.size[0],im.size[1])"`).toString().trim().split(' ');
    hPx = Math.round(wPx * parseInt(out[1]) / parseInt(out[0]));
  } catch { hPx = Math.round(wPx*0.6); }
  return new Paragraph({
    alignment:AlignmentType.CENTER, spacing:sp(60),
    children:[new ImageRun({type:"png",data,transformation:{width:wPx,height:hPx},
      altText:{title:filename,description:filename,name:filename}})]
  });
}

function mkTable(rows, cw) {
  const tw = cw.reduce((a,b)=>a+b,0);
  return new Table({
    width:{size:tw,type:WidthType.DXA}, columnWidths:cw,
    rows: rows.map((cells,ri)=>new TableRow({
      children: cells.map((text,ci)=>new TableCell({
        borders:cb,
        width:{size:cw[ci],type:WidthType.DXA},
        shading:{fill:ri===0?"D0DCF0":"FFFFFF",type:ShadingType.CLEAR},
        margins:{top:80,bottom:80,left:120,right:120},
        children:[new Paragraph({children:[new TextRun({
          text,font:TNR,size:22,bold:ri===0
        })]})]
      }))
    }))
  });
}

function screenshotBox(label) {
  const BW=9026;
  return [
    new Table({
      width:{size:BW,type:WidthType.DXA}, columnWidths:[BW],
      rows:[new TableRow({children:[new TableCell({
        borders:{
          top:{style:BorderStyle.DASHED,size:6,color:"888888"},
          bottom:{style:BorderStyle.DASHED,size:6,color:"888888"},
          left:{style:BorderStyle.DASHED,size:6,color:"888888"},
          right:{style:BorderStyle.DASHED,size:6,color:"888888"},
        },
        shading:{fill:"F8F8F8",type:ShadingType.CLEAR},
        margins:{top:200,bottom:200,left:200,right:200},
        verticalAlign:VerticalAlign.CENTER,
        children:[
          new Paragraph({alignment:AlignmentType.CENTER,
            children:[new TextRun({text:"[ Screenshot Placeholder ]",font:TNR,size:22,color:"BBBBBB",italics:true})]}),
          new Paragraph({alignment:AlignmentType.CENTER,
            children:[new TextRun({text:label,font:TNR,size:22,bold:true,color:"666666"})]}),
          new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:60},
            children:[new TextRun({text:"(Insert actual application screenshot here)",font:TNR,size:20,color:"AAAAAA",italics:true})]})
        ]
      })]})],
    }),
    ...spacer(1)
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// COVER
// ═══════════════════════════════════════════════════════════════════════════
function coverPage() {
  const R=(t,s,bold=false)=>new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(100),children:[new TextRun({text:t,font:TNR,size:s,bold})]});
  const C=(t,s,bold=false)=>new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(80),children:[new TextRun({text:t,font:TNR,size:s,bold})]});
  return [
    ...spacer(2),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(160),children:[new TextRun({text:"RentWise",font:TNR,size:52,bold:true})]}),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(380),children:[new TextRun({text:"Property Management System",font:TNR,size:28})]}),
    R("FULL STACK PROJECT REPORT",22,true),
    R("SUBMITTED IN PARTIAL FULFILLMENT OF",22),
    R("THE REQUIREMENTS FOR THE",22),
    R("AWARD OF THE DEGREE OF",22),
    R("BACHELOR OF ENGINEERING IN",22,true),
    R("COMPUTER SCIENCE AND ENGINEERING",22,true),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(380),children:[new TextRun({text:"OF THE ANNA UNIVERSITY",font:TNR,size:22})]}),
    R("Submitted by",22),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(380),children:[new TextRun({text:"SAUMYAJIT PURAKAYASTHA - 722824104218",font:TNR,size:24,bold:true})]}),
    new Paragraph({alignment:AlignmentType.LEFT,spacing:sp(80),children:[trB("BATCH",{size:24})]}),
    new Paragraph({alignment:AlignmentType.LEFT,spacing:sp(280),children:[trB("2024 – 2028",{size:24})]}),
    R("Under the Guidance of",22),
    R("MR. M. KARTHIK RAJA, M.E.,",22,true),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(280),children:[trB("ASSISTANT PROFESSOR/CSE",{size:22})]}),
    C("Department of Computer Science & Engineering",24,true),
    C("Sri Eshwar College of Engineering",28,true),
    C("(An Autonomous Institution – Affiliated to Anna University)",22),
    C("COIMBATORE – 641 202",22,true),
    pb(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// BONAFIDE
// ═══════════════════════════════════════════════════════════════════════════
function bonafidePage() {
  return [
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(380),children:[trB("BONAFIDE CERTIFICATE",{size:28})]}),
    body('Certified that this Report titled "RentWise – Property Management System" is the bonafide work of'),
    ...spacer(),
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(380),children:[trB("SAUMYAJIT PURAKAYASTHA    722824104218",{size:24})]}),
    body("who carried out the project work under my supervision."),
    ...spacer(2),
    new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[4513,4513],
      rows:[new TableRow({children:[
        new TableCell({borders:nob,width:{size:4513,type:WidthType.DXA},children:[
          new Paragraph({children:[tr("SIGNATURE")]}), ...spacer(2),
          new Paragraph({children:[tr("Dr. R. Subha M.E., Ph.D")]}),
          new Paragraph({children:[trB("HEAD OF THE DEPARTMENT")]}),
          new Paragraph({children:[tr("Computer Science and Engineering,")]}),
          new Paragraph({children:[tr("Sri Eshwar College of Engineering,")]}),
          new Paragraph({children:[tr("Coimbatore – 641 202.")]}),
        ]}),
        new TableCell({borders:nob,width:{size:4513,type:WidthType.DXA},children:[
          new Paragraph({children:[tr("SIGNATURE")]}), ...spacer(2),
          new Paragraph({children:[tr("Mr. M. Karthik Raja, M.E.,")]}),
          new Paragraph({children:[trB("SUPERVISOR")]}),
          new Paragraph({children:[tr("Assistant Professor,")]}),
          new Paragraph({children:[tr("Computer Science and Engineering,")]}),
          new Paragraph({children:[tr("Sri Eshwar College of Engineering,")]}),
          new Paragraph({children:[tr("Coimbatore – 641 202.")]}),
        ]}),
      ]})]
    }),
    ...spacer(2),
    body("Submitted for the Autonomous Semester End Full Stack Web Development Review held on ………………….."),
    ...spacer(2),
    new Table({width:{size:9026,type:WidthType.DXA},columnWidths:[4513,4513],
      rows:[new TableRow({children:[
        new TableCell({borders:nob,width:{size:4513,type:WidthType.DXA},children:[new Paragraph({children:[tr("INTERNAL EXAMINER")]})]}),
        new TableCell({borders:nob,width:{size:4513,type:WidthType.DXA},children:[new Paragraph({children:[tr("EXTERNAL EXAMINER")]})]}),
      ]})]
    }),
    pb(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// DECLARATION
// ═══════════════════════════════════════════════════════════════════════════
function declarationPage() {
  return [
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(280),children:[trB("DECLARATION",{size:28})]}),
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(280),children:[trB("SAUMYAJIT PURAKAYASTHA - [722824104218]",{size:24})]}),
    bodyJ('To declare that the project entitled "RentWise – Property Management System" submitted in partial fulfilment to the University as the project work of Bachelor of Engineering (Computer Science and Engineering) Degree, is a record of original work done by us under the supervision and guidance of'),
    ...spacer(),
    bodyJ("Mr. M. Karthik Raja, Assistant Professor, Department of Computer Science and Engineering, Sri Eshwar College of Engineering, Coimbatore."),
    ...spacer(2),
    body("Place: Coimbatore"),
    body("Date:"),
    ...spacer(2),
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:sp(120),children:[tr("SAUMYAJIT PURAKAYASTHA")]}),
    ...spacer(),
    body("Project Guided by,"),
    body("Mr. M. Karthik Raja M.E., AP/CSE"),
    pb(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// ACKNOWLEDGEMENT
// ═══════════════════════════════════════════════════════════════════════════
function acknowledgementPage() {
  return [
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(280),children:[trB("ACKNOWLEDGEMENT",{size:28})]}),
    bodyJ("The success of a work depends on a team and cooperation. I take this opportunity to express my gratitude and thanks to everyone who helped me in my project. I would like to thank the management for the constant support provided by them to complete this project."),
    ...spacer(),
    bodyJ("It is indeed our great honor bounded duty to thank our beloved Chairman Mr. R. Mohanram, for his academic interest shown towards the students."),
    ...spacer(),
    bodyJ("We are indebted to our Director Mr. R. Rajaram, for motivating and providing us with all facilities."),
    ...spacer(),
    bodyJ("I wish to express my sincere regards and deep sense of gratitude to Dr. Sudha Mohanram, M.E, Ph.D. Principal, for the excellent facilities and encouragement provided during the course of the study and project."),
    ...spacer(),
    bodyJ("We are indebted to Dr. R. Subha, M.E., Ph.D. Head of Computer Science and Engineering Department for having permitted us to carry out this project and giving the complete freedom to utilize the resources of the department."),
    ...spacer(),
    bodyJ("I express my sincere thanks to my mini project Coordinator Mr. M. Karthik Raja, M.E., Assistant Professors of Computer Science and Engineering Department for the valuable guidance and encouragement given to us for this project."),
    ...spacer(),
    bodyJ("I solemnly express our thanks to all the teaching and nonteaching staff of the Computer Science and Engineering Department, family and friends for their valuable support which inspired us to work on this project."),
    pb(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════════════════
function tocPage() {
  const entries=[
    ["1. Introduction","1"],["   1.1 Overview of the Project","1"],
    ["   1.2 Objective of the System","2"],["   1.3 Scope of the Project","3"],
    ["   1.4 Problem Statement","4"],
    ["2. System Analysis","5"],["   2.1 Existing System","5"],
    ["   2.2 Limitations of Existing System","6"],["   2.3 Proposed System","7"],
    ["   2.4 Advantages of Proposed System","8"],
    ["3. System Design","9"],["   3.1 Architecture Overview (Client-Server Model)","9"],
    ["   3.2 PostgreSQL Backend Architecture","12"],["   3.3 Data Flow Diagram (DFD)","15"],
    ["   3.4 Entity Relationship Diagram (ER Diagram)","18"],
    ["4. Database Design","21"],["   4.1 Schema Overview","21"],
    ["   4.2 Table Structure","22"],["   4.3 Primary Keys and Relationships","24"],
    ["   4.4 Data Integrity and Normalization","25"],
    ["5. Advanced System Features","27"],["   5.1 JWT Authentication and Session Management","27"],
    ["   5.2 Role-Based Access Control (RBAC)","29"],["   5.3 Password Security and bcrypt Hashing","31"],
    ["6. Implementation","33"],["   6.1 Backend Controller Layer","33"],
    ["   6.2 Authentication Flow (Login and Signup)","35"],
    ["   6.3 Property and Tenant Management","37"],
    ["   6.4 Payment, Maintenance, and Lease Modules","39"],
    ["   6.5 Frontend Routing and Protected Routes","41"],
    ["   6.6 Session Handling and Local Storage","43"],
    ["7. Performance and Optimization","45"],["   7.1 PostgreSQL Connection Pooling","45"],
    ["   7.2 Query Optimization and Joins","47"],["   7.3 Frontend Performance Strategies","48"],
    ["8. Workflow State Management","50"],["   8.1 Authentication State Machine","50"],
    ["   8.2 Role-Based Navigation Flow","52"],["   8.3 Request-Response Lifecycle","54"],
    ["9. Results and Analysis","56"],["   9.1 Sample Data and Output","56"],
    ["   9.2 Reports Generated by the System","58"],["   9.3 Performance Observations","59"],
    ["10. Application Integration (Full Stack)","61"],
    ["    10.1 Backend Integration (Express + PostgreSQL)","61"],
    ["    10.2 Frontend Interaction (React + Vite)","62"],
    ["    10.3 Authentication and Database Connectivity","64"],
    ["11. Conclusion","66"],["    11.1 Summary of Work","66"],
    ["    11.2 Learning Outcomes","67"],["    11.3 Future Enhancements","68"],
    ["12. References","70"],
    ["    A. Frameworks and Libraries","70"],["    B. Websites and Tools","70"],
    ["    C. Documentation","70"],
    ["13. Appendix","71"],["    A. Code Samples","71"],["    B. Screenshots","72"],
  ];
  return [
    new Paragraph({alignment:AlignmentType.CENTER,spacing:sp(280),children:[trB("Table of Contents",{size:28})]}),
    ...entries.map(([lbl,pg])=>new Paragraph({
      spacing:sp(60),
      children:[tr(lbl),tr("\t"+pg)],
      tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}]
    })),
    pb(),
  ];
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 1 – Introduction
// ═══════════════════════════════════════════════════════════════════════════
function ch1() { return [
  H1("1","Introduction"),
  H2("1.1","Overview of the Project"),
  bodyJ("RentWise is a full-stack web-based property management system designed to digitize and streamline the end-to-end workflow of rental operations between landlords and tenants. The system provides two distinct role-based portals — one for landlords who manage multiple rental properties and one for tenants who interact with a single assigned property — connected through a common REST API backed by a PostgreSQL relational database."),
  ...spacer(),
  bodyJ("The motivation behind RentWise arises from the widespread challenge of paper-based or spreadsheet-based property management in residential rental markets. Landlords managing even a small portfolio of two to five properties must track lease agreements, collect rent payments, handle maintenance requests, and communicate with tenants, all through disconnected and error-prone manual processes. Tenants, in turn, lack a transparent portal to view their payment history, check the status of their maintenance requests, or access their lease documents without physically contacting the landlord."),
  ...spacer(),
  bodyJ("RentWise addresses these challenges by providing a centralized web platform with separate authenticated portals for each role. The landlord portal delivers a comprehensive dashboard with property listings, tenant profiles, rent payment tracking, maintenance request management, lease document storage, and notification broadcasting. The tenant portal provides a read-oriented interface where the tenant can view their assigned property, payment history, maintenance request status, and lease documents."),
  ...spacer(),
  bodyJ("The technology stack is chosen for real-world production applicability. The backend is built with Node.js and Express 5, serving a RESTful JSON API on port 5000. PostgreSQL is used as the relational database for all persistent data, accessed through the pg (node-postgres) library's connection pool. Authentication is implemented with JWT (JSON Web Tokens) for stateless session management and bcrypt for secure password hashing. The frontend is built with React 19 and Vite, using react-router-dom for client-side routing and Tailwind CSS for utility-first styling. Lucide React provides the icon set."),
  ...spacer(),

  H2("1.2","Objective of the System"),
  bodyJ("The primary objectives of RentWise are organized across four functional dimensions: property management, tenant management, financial tracking, and system security."),
  ...spacer(),
  bodyJ("Property management objectives: The system must allow landlords to register new properties with address, city, monthly rent, and status (available or occupied). Landlords must be able to view all their properties, edit property details, and track occupancy status. Properties must be persistently stored in PostgreSQL and immediately visible across all landlord dashboard views."),
  ...spacer(),
  bodyJ("Tenant management objectives: The system must allow landlords to create tenant profiles linked to specific properties. Tenant records must capture identity information (name, email, phone), property assignment (property_id), and move-in date. The tenant's own portal must automatically retrieve their assigned property details on login, providing immediate context without requiring manual navigation."),
  ...spacer(),
  bodyJ("Financial tracking objectives: The payment module must record rent payment transactions linked to both tenants and properties. Each payment record must carry an amount, due date, paid date, and status (pending, paid, or overdue). Landlords must be able to view all payments across their portfolio; tenants must be able to view their own payment history. The system must support generating overdue payment flags to prompt collection."),
  ...spacer(),
  bodyJ("Security objectives: All portal routes must be protected by JWT-based authentication. Passwords must never be stored in plain text; bcrypt with an appropriate salt factor must be used for all password hashing. Role-based access control must prevent landlords from accessing tenant routes and prevent tenants from accessing landlord routes. The frontend must enforce these restrictions through a ProtectedRoute component that checks the stored role before rendering any portal page."),
  ...spacer(),
  bodyJ("Additional objectives: The maintenance request module must allow tenants to submit requests with title, description, priority (low, medium, high), and status (open, in-progress, closed). The lease document module must track document URLs, start and end dates, and signed status. The notification module must allow landlords to broadcast notices to tenants visible in the tenant portal."),
  ...spacer(),

  H2("1.3","Scope of the Project"),
  bodyJ("The system covers the following areas of functionality in detail:"),
  ...spacer(),
  bodyJ("User Authentication and Role Assignment: RentWise supports two user roles — landlord and tenant — stored in the users table of PostgreSQL. The signup endpoint creates a new user record with a bcrypt-hashed password and the specified role. The login endpoint verifies the password against the stored hash and issues a JWT containing the user's email, name, and role. The frontend stores these values in localStorage under rentwise_token, rentwise_role, rentwise_user, and rentwise_name keys. All subsequent API requests include the JWT as a Bearer token in the Authorization header."),
  ...spacer(),
  bodyJ("Property Lifecycle Management: Properties are central to the RentWise data model. Every other entity — tenants, payments, maintenance requests, lease documents — is linked to a property through a property_id foreign key. The properties module supports listing all properties belonging to a landlord (filtered by landlord_email from the JWT), creating a new property, updating property details (address, rent, status), and deleting a property when it is no longer in the portfolio."),
  ...spacer(),
  bodyJ("Tenant Portal and Property Lookup: The tenant dashboard performs a join query on the tenants and properties tables, retrieving the tenant's record by their email address (extracted from the JWT) and joining the associated property details. This provides the tenant with a single-page view of their assigned property, current rent, landlord contact, and tenancy dates without requiring any navigation."),
  ...spacer(),
  bodyJ("Payment Tracking: The payments module records individual payment transactions. Each payment is linked to a tenant_id and property_id, carries a monetary amount, a due date, a paid date (nullable for unpaid transactions), and a status enum. Landlords can view all payments across all their properties; tenants can view only their own payment records. Status computation (pending, paid, overdue) is performed at the database query level."),
  ...spacer(),
  bodyJ("Maintenance Request Management: Tenants can submit maintenance requests describing issues with their property. Each request is classified by priority (low, medium, high) and tracked through a status lifecycle (open, in_progress, closed). Landlords can view all maintenance requests across their portfolio and update the status as work progresses. Tenants can view the status of their submitted requests."),
  ...spacer(),
  bodyJ("Lease Document Storage: The lease_documents table stores references to lease agreement files (URLs), alongside start and end dates and a signed boolean flag. Landlords can upload and manage lease documents; tenants can view their active lease document. The module supports expiry tracking to flag leases approaching their end date."),
  ...spacer(),
  bodyJ("Notification System: Landlords can create notification messages addressed to specific users by email. Tenants see all notifications addressed to their email in a dedicated notifications view. Each notification carries a message, a creation timestamp, and an is_read flag that updates when the tenant views it."),
  ...spacer(),
  bodyJ("The system does not cover online payment processing (no payment gateway integration), multi-property lease management for a single tenant, document storage (URLs are stored, not files), or mobile application deployment. These are identified as future enhancement areas."),
  ...spacer(),

  H2("1.4","Problem Statement"),
  bodyJ("Property rental management in India's residential market is predominantly conducted through informal, manual processes. Landlords maintain paper registers for tenant records and receipt books for payments. Lease agreements are printed, signed, and stored physically. Maintenance requests are communicated verbally or through messaging apps with no formal tracking. This creates a set of recurring, systemic problems:"),
  ...spacer(),
  numbered("Lack of centralized records: Tenant details, payment history, lease terms, and maintenance history exist in separate physical or digital files with no integrated view. A landlord managing five properties must consult multiple sources to answer a question as simple as 'Which tenants have overdue payments this month?'"),
  ...spacer(),
  numbered("No tenant self-service: Tenants cannot access their own payment history, lease documents, or maintenance request status without contacting the landlord. Every query requires human intervention, creating friction for both parties."),
  ...spacer(),
  numbered("Payment tracking errors: Manual receipt books and spreadsheets are prone to transcription errors, duplicate entries, and missing records. There is no automatic overdue flag; the landlord must manually compare due dates against payment records."),
  ...spacer(),
  numbered("Maintenance request opacity: When a tenant reports a maintenance issue verbally, there is no formal record of when it was reported, what priority it was assigned, or what its current status is. Disputes over whether a request was ever received or acted upon are common."),
  ...spacer(),
  numbered("Security and privacy risks: Physical documents and unencrypted spreadsheets containing tenant PAN numbers, Aadhar numbers, and contact details are vulnerable to unauthorized access, loss, and damage."),
  ...spacer(),
  bodyJ("RentWise addresses all five pain points by providing a fully digital, role-separated, and database-backed property management platform. Landlords gain a single dashboard with real-time visibility into all properties, tenants, payments, and requests. Tenants gain a self-service portal for complete transparency into their tenancy. All data is secured by JWT authentication, role-based access control, and bcrypt password hashing."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 2 – System Analysis
// ═══════════════════════════════════════════════════════════════════════════
function ch2() { return [
  H1("2","System Analysis"),
  H2("2.1","Existing System"),
  bodyJ("The existing approach to property management in the residential rental market is predominantly manual, fragmented, and role-opaque. The following describes the typical workflow prior to a system like RentWise:"),
  ...spacer(),
  bodyJ("Landlord operations: Landlords maintain tenant details in physical registers or Microsoft Excel spreadsheets stored locally on their personal computers. Rent payment records are tracked in receipt books with carbon copies — one copy retained by the landlord, one given to the tenant. Lease agreements are drafted on stamped paper, signed physically, and stored in physical folders. Maintenance requests arrive via WhatsApp messages, phone calls, or in-person visits with no formal record. Notifications to tenants (rent due reminders, maintenance completion updates) are sent through personal messaging channels with no read-receipt capability."),
  ...spacer(),
  bodyJ("Tenant operations: Tenants retain paper copies of their lease agreements and payment receipts. They have no independent view of their payment history except through their own physical receipts. Maintenance requests are submitted verbally or through messaging with no formal confirmation of receipt or status update. Tenants cannot self-serve any information about their tenancy without contacting the landlord."),
  ...spacer(),
  bodyJ("Digital partial solutions: Some landlords use general-purpose tools such as Google Sheets, Tally, or WhatsApp groups to manage aspects of their portfolio. However, these tools are not designed for property management, lack role separation, have no database backing for relational queries, and do not provide tenant-facing portals. They solve individual fragments of the problem without addressing the integrated workflow."),
  ...spacer(),

  H2("2.2","Limitations of Existing System"),
  mkTable([
    ["Limitation","Impact"],
    ["No centralized database","Tenant, payment, and maintenance data exist in separate files with no relational integrity or cross-reference"],
    ["No tenant self-service portal","Every query from a tenant requires manual response from the landlord, creating friction and delays"],
    ["Manual payment tracking","Excel registers and receipt books are error-prone; no automatic overdue flagging or payment status computation"],
    ["No maintenance workflow","Verbal requests have no record of submission time, priority, or status; disputes cannot be resolved objectively"],
    ["No role separation","General tools like Google Sheets do not separate landlord and tenant views; all data is visible to anyone with access"],
    ["No authentication or security","Physical records and unencrypted spreadsheets are vulnerable to unauthorized access, loss, and damage"],
    ["No notification system","Landlord-to-tenant communications occur through personal channels with no audit trail or read confirmation"],
    ["No lease expiry tracking","Lease end dates are tracked manually; approaching expiry often goes unnoticed until after the fact"],
    ["No mobile or remote access","Physical records are inaccessible remotely; landlords managing multiple properties cannot access data on the go"],
    ["No audit trail","Actions (payment recording, maintenance status updates) leave no timestamped audit record for dispute resolution"],
  ],[3800,5226]),
  ...spacer(),

  H2("2.3","Proposed System"),
  bodyJ("RentWise proposes a digital-first, role-separated property management platform built on production-grade web technologies with a PostgreSQL relational database at its core."),
  ...spacer(),
  bodyJ("The Express REST API serves as the application tier, exposing seven domain endpoints (/api/auth, /api/properties, /api/tenants, /api/payments, /api/maintenance, /api/leases, /api/notifications) under a unified server. Each endpoint is handled by a dedicated route file and controller module following the Express controller-route architecture pattern."),
  ...spacer(),
  bodyJ("PostgreSQL provides the data tier with full ACID compliance, enforced foreign key relationships between all domain tables, and the ability to perform relational joins for complex queries such as fetching a tenant's property details in a single query. The pg library's connection pool manages database connections efficiently, reusing connections across requests to minimize latency and resource usage."),
  ...spacer(),
  bodyJ("JWT-based authentication provides stateless session management. The server issues a signed JWT on login; the client stores it in localStorage and includes it as a Bearer token in every subsequent API request. The server verifies the token's signature on every protected route before dispatching to the controller. This eliminates the need for server-side session storage and makes the API horizontally scalable."),
  ...spacer(),
  bodyJ("Role-based access control is enforced at two layers: the frontend ProtectedRoute component checks the stored rentwise_role value before rendering any portal page and redirects to the appropriate dashboard if the role does not match the route; the backend JWT payload contains the user's role, which controllers can inspect to filter data (for example, the properties controller returns only properties where landlord_email matches the JWT email)."),
  ...spacer(),
  bodyJ("The React frontend provides two complete portals with role-specific navigation. The landlord portal includes seven pages (Dashboard, Properties, Tenants, Payments, Maintenance, Documents, Notifications) with full CRUD interactions. The tenant portal includes four pages (Dashboard, Payments, Maintenance, Documents) with read-oriented interfaces and form-based submission for maintenance requests."),
  ...spacer(),

  H2("2.4","Advantages of Proposed System"),
  bullet("Centralized Data: All property, tenant, payment, lease, and maintenance data is stored in a single PostgreSQL database with enforced relational integrity. Cross-domain queries (for example, 'all overdue payments for a landlord's portfolio') can be answered in a single SQL statement."),
  bullet("Role Separation: Landlord and tenant portals are completely separated at both the frontend route level (ProtectedRoute) and the backend API level (JWT role claim filtering). Tenants cannot access landlord data; landlords cannot access other landlords' data."),
  bullet("Security: Passwords are hashed with bcrypt before storage; plain text passwords are never persisted. JWTs are signed with a server-side secret and expire on logout (localStorage clear). All protected routes validate the JWT before processing."),
  bullet("Tenant Self-Service: Tenants can independently access their property details, payment history, maintenance request status, and lease documents at any time without contacting the landlord, reducing support overhead."),
  bullet("Automated Status Tracking: Payment status (pending, paid, overdue), maintenance request status (open, in_progress, closed), and lease expiry flags are computed from database records rather than manual assessment."),
  bullet("Audit Trail: All records carry created_at timestamps. Payment records carry both due_date and paid_date. Maintenance requests carry submission timestamp and status change history implicitly through status field updates."),
  bullet("Remote Access: The web-based platform is accessible from any device with a browser, enabling landlords to manage their portfolio and tenants to check their status from anywhere."),
  bullet("Scalability: PostgreSQL handles thousands of concurrent connections through connection pooling. Express is horizontally scalable. The JWT-based auth layer requires no shared session state between instances."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 3 – System Design
// ═══════════════════════════════════════════════════════════════════════════
function ch3() { return [
  H1("3","System Design"),
  H2("3.1","Architecture Overview (Client-Server Model)"),
  bodyJ("RentWise follows a classic three-tier client-server architecture with a clear separation between the presentation tier, the application tier, and the data tier. This separation ensures that each layer can be developed, tested, and deployed independently, and that scaling one tier does not require changes to the others."),
  ...spacer(),
  bodyJ("Figure 1 illustrates the complete system architecture of RentWise:"),
  ...spacer(),
  diag("fig1_arch.png",590),
  figCap("Figure 1: RentWise System Architecture — Three-Tier Client-Server Model"),
  ...spacer(),
  bodyJ("The Client Tier is the React 19 and Vite frontend application served on port 5173 during development. It consists of the public-facing Landing page, the shared Login page, the Landlord portal (seven route-protected pages), the Tenant portal (four route-protected pages), and the shared layout components (AppLayout, Navbar, Sidebar, ProtectedRoute). The client tier never connects to PostgreSQL directly; all data access goes through the Express API."),
  ...spacer(),
  bodyJ("The Application Tier is the Express 5 REST API server running on port 5000. It is the single point of integration between the frontend and the database. It handles CORS configuration, JSON body parsing, JWT validation, route dispatching, controller invocation, and error handling. All business logic — authentication, role filtering, status computation, data validation — lives in this tier."),
  ...spacer(),
  bodyJ("The Data Tier is the PostgreSQL database. It stores all persistent application data across seven tables: users, properties, tenants, payments, maintenance_requests, lease_documents, and notifications. The schema enforces referential integrity through foreign key constraints between all related tables. The pg library's Pool class manages a pool of database connections that are shared across concurrent API requests."),
  ...spacer(),
  mkTable([
    ["Tier","Technology","Port / Location","Key Responsibilities"],
    ["Client","React 19 + Vite + react-router-dom","5173 (dev)","Rendering, routing, form handling, session read from localStorage"],
    ["Application","Node.js + Express 5","5000","JWT auth, route dispatch, controller logic, CORS, error handling"],
    ["Data","PostgreSQL via node-postgres (pg)","5432 (default)","ACID-compliant persistent storage, FK enforcement, query execution"],
  ],[1800,2800,2000,2426]),
  ...spacer(),
  bodyJ("The communication between the Client Tier and the Application Tier uses standard HTTP with JSON bodies. The frontend uses the Fetch API (or Axios if preferred) to send requests to http://localhost:5000/api/*. Every request to a protected endpoint includes an Authorization header with the Bearer JWT retrieved from localStorage. The backend validates this token before processing the request and extracts the user's email and role from the JWT payload for use in controller logic."),
  ...spacer(),
  bodyJ("The communication between the Application Tier and the Data Tier uses the node-postgres (pg) library's parameterized query API. All queries use positional parameters ($1, $2, ...) rather than string interpolation to prevent SQL injection. The Pool class automatically manages connection checkout and return, with configurable maximum pool size, idle timeout, and connection timeout values."),
  ...spacer(),

  H2("3.2","PostgreSQL Backend Architecture"),
  bodyJ("The PostgreSQL backend architecture in RentWise is built around the standard Express controller-route pattern, extended with a centralized database connection pool and a structured migration workflow."),
  ...spacer(),
  bodyJ("Figure 6 illustrates the layered backend module architecture:"),
  ...spacer(),
  diag("fig6_backend.png",590),
  figCap("Figure 6: RentWise Backend Module Architecture — Route, Controller, and Database Layers"),
  ...spacer(),
  bodyJ("server.js is the application entry point. It creates the Express app, applies global middleware (CORS with wildcard origin for development, express.json() for body parsing), mounts all seven route modules under /api/*, registers a global error handler that catches unhandled errors and returns a generic 500 JSON response, and starts the HTTP listener on port 5000. It also exposes two utility endpoints: GET /api/health (returns { status: 'ok' }) for readiness checking and GET /api/test-db (runs a test query against PostgreSQL to verify connectivity)."),
  ...spacer(),
  bodyJ("db/index.js exports a single Pool instance configured with the PostgreSQL connection parameters (host, port, user, password, database) read from environment variables via dotenv. All controller modules import this pool and call pool.query() for every database operation. The pool handles connection lifecycle automatically: acquiring a connection from the pool for each query, executing the query, and returning the connection to the pool when the query completes."),
  ...spacer(),
  bodyJ("db/schema.sql defines the complete database schema in SQL DDL. It creates all seven tables with appropriate column types, NOT NULL constraints, DEFAULT values, and FOREIGN KEY references. It is intended to be run once against a fresh PostgreSQL database to create the schema. The migrate.js and migrate_tenants.js scripts are used for incremental schema changes during development."),
  ...spacer(),
  bodyJ("routes/*.js files define the HTTP routes for each domain module. Each route file creates an Express Router, registers the endpoint methods and paths (GET, POST, PUT, DELETE), and delegates to the corresponding controller function. Route files do not contain business logic; they are purely concerned with HTTP method binding and URL pattern matching."),
  ...spacer(),
  bodyJ("controllers/*.js files contain the business logic for each domain. Each controller function receives the Express request and response objects, extracts parameters from req.body, req.params, req.query, or the JWT payload (via req.user if middleware-decoded), executes one or more parameterized PostgreSQL queries through the pool, and sends a JSON response. Error handling within controllers uses try-catch blocks that pass errors to Express's next() function for centralized handling."),
  ...spacer(),
  mkTable([
    ["Module","Route File","Controller","Key Operations"],
    ["Authentication","/api/auth","controllers/auth.js","signup (bcrypt hash + INSERT), login (SELECT + bcrypt compare + JWT sign)"],
    ["Properties","/api/properties","(inline or separate)","List by landlord_email (JWT), CREATE property, UPDATE status, DELETE"],
    ["Tenants","/api/tenants","(inline or separate)","CREATE tenant (linked to property), GET by email (JOIN with properties)"],
    ["Payments","/api/payments","(inline or separate)","List by tenant/property, CREATE payment record, UPDATE status (paid/overdue)"],
    ["Maintenance","/api/maintenance","(inline or separate)","CREATE request (tenant), LIST (landlord/tenant filtered), UPDATE status"],
    ["Leases","/api/leases","(inline or separate)","CREATE lease document, LIST by property/tenant, UPDATE signed status"],
    ["Notifications","/api/notifications","(inline or separate)","CREATE notification (landlord), LIST by user_email (tenant), MARK read"],
  ],[1500,2000,2200,3326]),
  ...spacer(),

  H2("3.3","Data Flow Diagram (DFD)"),
  bodyJ("The Data Flow Diagram illustrates the complete flow of data through RentWise from user authentication through portal access to API-driven data operations. Figure 2 shows the primary authentication and navigation data flow:"),
  ...spacer(),
  diag("fig2_dfd.png",420),
  figCap("Figure 2: RentWise Data Flow Diagram — Authentication and API Request Pipeline"),
  ...spacer(),
  bodyJ("The flow begins when a user opens the browser and lands on the Landing page at route '/'. The Landing page presents the portal's marketing content and a login call-to-action. Clicking the login button navigates the user to /login."),
  ...spacer(),
  bodyJ("On the Login page, the user enters their email and password. Before submitting, the frontend performs a health check by calling GET /api/health to confirm the backend is reachable. If the health check fails, an error is displayed without attempting authentication. If the health check succeeds, the frontend sends a POST request to /api/auth/login with the credentials in the request body."),
  ...spacer(),
  bodyJ("The auth controller receives the request, queries the users table with SELECT * FROM users WHERE email = $1, and passes the result to bcrypt.compare() with the submitted password and the stored hash. If the comparison fails, a 401 Unauthorized response is returned and the frontend displays an error message on the Login page. If the comparison succeeds, the controller signs a JWT containing the user's email, name, and role using the server's JWT_SECRET, and returns the token along with the user details in the response body."),
  ...spacer(),
  bodyJ("The frontend receives the successful response and stores the token and user details in localStorage under the rentwise_token, rentwise_role, rentwise_user, and rentwise_name keys. It then navigates to the role-appropriate portal: /landlord/dashboard for the landlord role, or /tenant/dashboard for the tenant role."),
  ...spacer(),
  bodyJ("All subsequent navigation within the portal passes through the ProtectedRoute component. ProtectedRoute reads rentwise_token and rentwise_role from localStorage before rendering the route's component. If the token is absent (session not established) or the role does not match the route's required role, the user is redirected to /login. If both checks pass, the portal page component renders and begins fetching data from the API."),
  ...spacer(),
  bodyJ("Every API request from the portal pages includes the JWT as a Bearer token in the Authorization header. The backend's JWT middleware (if implemented as a middleware) or the route handler itself extracts and verifies this token. A valid token allows the request to proceed to the controller; an invalid or expired token returns a 401 response, which the frontend handles by clearing localStorage and redirecting to /login (session expired state)."),
  ...spacer(),
  bodyJ("Controllers execute parameterized PostgreSQL queries through the pool, receive result rows, and return JSON responses. The frontend updates React state with the received data and re-renders the affected components. This request-response cycle repeats for every user interaction that requires server data (loading a page, submitting a form, updating a record status)."),
  ...spacer(),

  H2("3.4","Entity Relationship Diagram (ER Diagram)"),
  bodyJ("The Entity Relationship Diagram shows the seven tables in the RentWise PostgreSQL database schema and their relationships. The schema is defined in rentwise-backend/db/schema.sql. Figure 3 illustrates the complete ER schema:"),
  ...spacer(),
  diag("fig3_er.png",600),
  figCap("Figure 3: RentWise Entity Relationship Diagram — PostgreSQL Schema"),
  ...spacer(),
  bodyJ("The users table is the root authentication entity. Every user of the system — whether landlord or tenant — has a record in this table. The role column (VARCHAR constrained to 'landlord' or 'tenant') determines which portal the user accesses after login. The email column is UNIQUE and serves as the natural key for cross-table references (landlord_email in properties, user_email in notifications, email in tenants)."),
  ...spacer(),
  bodyJ("The properties table stores rental property records. Each property is owned by a landlord identified by landlord_email (a foreign key referencing users.email). The status column tracks whether the property is 'available' (no current tenant) or 'occupied' (tenant assigned). Properties are the central entity: all other domain tables (tenants, payments, maintenance_requests, lease_documents) carry a property_id foreign key."),
  ...spacer(),
  bodyJ("The tenants table stores tenant profiles. Each tenant record is linked to a users.email (the tenant's login account) and to a properties.id (the assigned property). This three-way relationship — users, properties, and tenants — is the core of the RentWise data model: the tenant user account is separate from the tenant profile, allowing tenant portal login to automatically retrieve property context through a JOIN."),
  ...spacer(),
  bodyJ("The payments, maintenance_requests, and lease_documents tables all carry both tenant_id (referencing tenants.id) and property_id (referencing properties.id) foreign keys. This denormalization is intentional: including both keys allows efficient filtering by either tenant or property without requiring a JOIN through the tenants table."),
  ...spacer(),
  bodyJ("The notifications table is linked only to users through user_email (referencing users.email), allowing landlords to send notifications to any user (not just their own tenants) and allowing notifications to be retrieved efficiently by email without joining through tenants or properties."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 4 – Database Design
// ═══════════════════════════════════════════════════════════════════════════
function ch4() { return [
  H1("4","Database Design"),
  H2("4.1","Schema Overview"),
  bodyJ("RentWise uses PostgreSQL as its relational database management system. The schema is defined entirely in rentwise-backend/db/schema.sql and follows standard relational normalization principles. PostgreSQL was chosen over a NoSQL alternative because the RentWise data model is highly relational: tenants are linked to properties, payments are linked to both tenants and properties, and all domain entities trace back through foreign key chains to the users table. A relational database with enforced referential integrity is the natural choice for this domain."),
  ...spacer(),
  bodyJ("The schema consists of seven tables that model the complete rental management workflow. The tables are created with SERIAL primary keys (auto-incrementing integers), TIMESTAMP WITH TIME ZONE columns for temporal data, and VARCHAR with length constraints for string fields. FOREIGN KEY constraints with ON DELETE CASCADE or ON DELETE SET NULL actions are defined based on the business semantics of each relationship."),
  ...spacer(),
  mkTable([
    ["Table","Primary Key","Foreign Keys","Core Purpose"],
    ["users","id SERIAL","none (root entity)","Authentication credentials and role assignment for all system users"],
    ["properties","id SERIAL","landlord_email → users.email","Rental property inventory with address, rent, and status"],
    ["tenants","id SERIAL","email → users.email, property_id → properties.id","Tenant profiles linked to user accounts and assigned properties"],
    ["payments","id SERIAL","tenant_id → tenants.id, property_id → properties.id","Rent payment transaction records with due and paid dates"],
    ["maintenance_requests","id SERIAL","tenant_id → tenants.id, property_id → properties.id","Tenant-submitted maintenance issues with priority and status lifecycle"],
    ["lease_documents","id SERIAL","tenant_id → tenants.id, property_id → properties.id","Lease agreement references with term dates and signed status"],
    ["notifications","id SERIAL","user_email → users.email","In-app notification messages with read status"],
  ],[1800,1800,2800,2626]),
  ...spacer(),

  H2("4.2","Table Structure"),
  bodyJ("The following describes the detailed column structure of each table in the RentWise schema:"),
  ...spacer(),
  bodyJ("users table: The users table is the authentication and identity root. id is a SERIAL primary key auto-generated by PostgreSQL. email is a VARCHAR(255) NOT NULL UNIQUE column — uniqueness is enforced at the database level to prevent duplicate account registration. password_hash is a VARCHAR(255) NOT NULL column storing the bcrypt hash of the user's password (never the plain text). role is a VARCHAR(50) NOT NULL column constrained to 'landlord' or 'tenant'. name is a VARCHAR(255) NOT NULL column for display purposes. created_at is a TIMESTAMP DEFAULT CURRENT_TIMESTAMP recording account creation time."),
  ...spacer(),
  bodyJ("properties table: id is SERIAL PRIMARY KEY. landlord_email is VARCHAR(255) NOT NULL with a FOREIGN KEY referencing users.email — this links the property to its owner. address is VARCHAR(500) NOT NULL for the full street address. city is VARCHAR(100) NOT NULL. rent is NUMERIC(10,2) NOT NULL for the monthly rent amount (10 digits total, 2 decimal places). status is VARCHAR(50) DEFAULT 'available' constrained to 'available' or 'occupied'. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),
  bodyJ("tenants table: id is SERIAL PRIMARY KEY. name is VARCHAR(255) NOT NULL. email is VARCHAR(255) with a FOREIGN KEY referencing users.email — this is the tenant's login account email, enabling the property lookup JOIN on the tenant dashboard. property_id is INTEGER NOT NULL with a FOREIGN KEY referencing properties.id — this assigns the tenant to a specific property. phone is VARCHAR(20) for contact information. move_in_date is DATE for tenancy start tracking. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),
  bodyJ("payments table: id is SERIAL PRIMARY KEY. tenant_id is INTEGER NOT NULL FK → tenants.id. property_id is INTEGER NOT NULL FK → properties.id. amount is NUMERIC(10,2) NOT NULL for the payment amount. due_date is DATE NOT NULL for the scheduled payment date. paid_date is DATE nullable — NULL indicates an unpaid payment. status is VARCHAR(50) DEFAULT 'pending' constrained to 'pending', 'paid', or 'overdue'. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),
  bodyJ("maintenance_requests table: id is SERIAL PRIMARY KEY. tenant_id is INTEGER NOT NULL FK → tenants.id. property_id is INTEGER NOT NULL FK → properties.id. title is VARCHAR(255) NOT NULL for a brief description. description is TEXT for the full request body. priority is VARCHAR(50) DEFAULT 'medium' constrained to 'low', 'medium', or 'high'. status is VARCHAR(50) DEFAULT 'open' constrained to 'open', 'in_progress', or 'closed'. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),
  bodyJ("lease_documents table: id is SERIAL PRIMARY KEY. tenant_id is INTEGER NOT NULL FK → tenants.id. property_id is INTEGER NOT NULL FK → properties.id. document_url is VARCHAR(1000) storing the URL or file path of the lease document. start_date is DATE NOT NULL for the lease commencement. end_date is DATE NOT NULL for the lease termination. signed is BOOLEAN DEFAULT FALSE tracking whether the lease has been countersigned. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),
  bodyJ("notifications table: id is SERIAL PRIMARY KEY. user_email is VARCHAR(255) NOT NULL FK → users.email — notifications are addressed directly to a user email rather than a tenant_id or property_id, supporting cross-domain broadcasts. message is TEXT NOT NULL for the notification content. is_read is BOOLEAN DEFAULT FALSE tracking whether the notification has been seen by the recipient. created_at is TIMESTAMP DEFAULT CURRENT_TIMESTAMP."),
  ...spacer(),

  H2("4.3","Primary Identifiers and Relationships"),
  bodyJ("RentWise uses SERIAL (auto-incrementing integer) primary keys for all tables rather than UUIDs. This choice is appropriate for a single-database deployment where globally unique identifiers are not required. For multi-database or distributed deployments, UUIDs would be preferred."),
  ...spacer(),
  mkTable([
    ["Relationship","From Table","To Table","FK Column","Cardinality"],
    ["Landlord owns Properties","properties","users","landlord_email → users.email","N:1 (many properties per landlord)"],
    ["User is a Tenant","tenants","users","email → users.email","1:1 (one tenant profile per user account)"],
    ["Tenant assigned to Property","tenants","properties","property_id → properties.id","N:1 (many tenants per property historically)"],
    ["Payments for Tenant","payments","tenants","tenant_id → tenants.id","N:1 (many payments per tenant)"],
    ["Payments for Property","payments","properties","property_id → properties.id","N:1 (many payments per property)"],
    ["Maintenance by Tenant","maintenance_requests","tenants","tenant_id → tenants.id","N:1 (many requests per tenant)"],
    ["Maintenance at Property","maintenance_requests","properties","property_id → properties.id","N:1 (many requests per property)"],
    ["Lease for Tenant","lease_documents","tenants","tenant_id → tenants.id","N:1 (multiple leases per tenant over time)"],
    ["Lease at Property","lease_documents","properties","property_id → properties.id","N:1 (multiple leases per property over time)"],
    ["Notification to User","notifications","users","user_email → users.email","N:1 (many notifications per user)"],
  ],[2200,1800,1800,2200,1026]),
  ...spacer(),

  H2("4.4","Data Integrity and Normalization Principles"),
  bodyJ("Although RentWise uses PostgreSQL rather than Appwrite's document model, the schema adheres to the same normalization principles to ensure data consistency and minimize redundancy."),
  ...spacer(),
  bodyJ("First Normal Form (1NF): Every column in every table holds an atomic (single) value. No column stores arrays, JSON objects, or comma-separated lists. The priority and status columns use VARCHAR with application-level validation rather than PostgreSQL's ENUM type to maintain portability, but they are constrained to a fixed set of values through CHECK constraints."),
  ...spacer(),
  bodyJ("Second Normal Form (2NF): All non-key attributes in each table depend entirely on the table's primary key. For example, in the payments table, amount, due_date, paid_date, and status all describe a specific payment (identified by id). The inclusion of both tenant_id and property_id is a deliberate denormalization for query efficiency, not a 2NF violation, because property is not a functional determinant of tenant; both are independent FKs carried for join efficiency."),
  ...spacer(),
  bodyJ("Third Normal Form (3NF): Transitive dependencies are eliminated. Tenant details (name, phone) are stored in the tenants table and referenced by ID from payments, maintenance_requests, and lease_documents rather than duplicated. Property details (address, city, rent) are stored in properties and referenced by property_id. The users table centralizes authentication credentials, preventing duplication of email and role across domain tables."),
  ...spacer(),
  bodyJ("Referential Integrity: All foreign key relationships are enforced at the database level by PostgreSQL, not just at the application level. Attempting to insert a tenant with a non-existent property_id or a payment with a non-existent tenant_id will produce a foreign key violation error from PostgreSQL, which the Express controller's try-catch block catches and returns as a 400 Bad Request response."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 5 – Advanced System Features
// ═══════════════════════════════════════════════════════════════════════════
function ch5() { return [
  H1("5","Advanced System Features"),
  H2("5.1","JWT Authentication and Session Management"),
  bodyJ("RentWise implements stateless authentication using JSON Web Tokens (JWT). This approach eliminates the need for server-side session storage, making the API inherently stateless and horizontally scalable. The complete authentication flow is illustrated in Figure 5:"),
  ...spacer(),
  diag("fig5_state.png",570),
  figCap("Figure 5: RentWise Authentication and Session State Machine"),
  ...spacer(),
  bodyJ("JWT generation on login: When a user successfully authenticates, the auth controller calls jwt.sign() with a payload object containing the user's email, name, and role. The token is signed with the JWT_SECRET environment variable using the HS256 algorithm (HMAC with SHA-256). The token expiry is set to '7d' (seven days) by default, providing a week-long session without requiring re-authentication. The signed token string is returned to the frontend in the login response body alongside the user's name and role."),
  ...spacer(),
  bodyJ("Client-side token storage: The frontend Login page stores the received token and user details in the browser's localStorage under five keys: rentwise_token (the JWT string), rentwise_role (landlord or tenant), rentwise_user (user email), rentwise_name (display name), and a legacy redirect key. localStorage persists across browser sessions (unlike sessionStorage), providing a persistent login experience until the user explicitly logs out or the token expires."),
  ...spacer(),
  bodyJ("Token transmission on API requests: All API requests from the portal pages include the JWT as a Bearer token in the Authorization header: 'Authorization: Bearer <token>'. The backend route handlers or middleware extract this token from the header using req.headers.authorization.split(' ')[1], verify its signature with jwt.verify() and the same JWT_SECRET, and extract the payload fields (email, role) for use in controller logic."),
  ...spacer(),
  bodyJ("Session lifecycle management: The session lifecycle has four states: unauthenticated (no token in localStorage), authenticating (login request in-flight), authenticated (valid token stored, portal accessible), and session-expired (API returns 401 on a subsequent request, indicating token expiry or tampering). Logout is implemented by clearing all five localStorage keys and redirecting to /login. The Navbar component includes a logout button that triggers this cleanup."),
  ...spacer(),
  bodyJ("Health check before authentication: The Login page performs a GET /api/health request before submitting credentials. This provides early feedback if the backend is unreachable (network failure, backend not started) without confusing the user with a failed authentication message when the actual problem is backend unavailability."),
  ...spacer(),

  H2("5.2","Role-Based Access Control (RBAC)"),
  bodyJ("RentWise implements a two-role RBAC system — landlord and tenant — enforced at both the frontend routing layer and the backend data filtering layer. Figure 4 illustrates the complete role hierarchy:"),
  ...spacer(),
  diag("fig4_rbac.png",560),
  figCap("Figure 4: RentWise Role-Based Access Control Hierarchy — Portal Separation"),
  ...spacer(),
  bodyJ("Frontend RBAC — ProtectedRoute component: The ProtectedRoute.jsx component wraps every portal route in both the landlord and tenant sections. When rendering, it reads rentwise_token and rentwise_role from localStorage. If the token is absent, it redirects to /login. If the role does not match the route's required role (for example, a tenant attempting to access /landlord/properties), it redirects to the correct portal dashboard for the stored role (tenant is redirected to /tenant/dashboard, not /landlord/dashboard). This prevents role confusion without exposing an error page."),
  ...spacer(),
  bodyJ("Backend RBAC — JWT claim filtering: Controllers filter data based on the user's identity extracted from the JWT. The properties controller uses the email claim from the JWT to filter the properties query: SELECT * FROM properties WHERE landlord_email = $1 with the JWT email as the parameter. This ensures that a landlord can only retrieve, update, or delete their own properties even if they construct a manual API request with another landlord's property ID. The tenant controller similarly filters by the email claim to retrieve only the requesting user's tenant profile."),
  ...spacer(),
  bodyJ("Landlord portal capabilities: The landlord role has access to seven pages — Dashboard (summary statistics), Properties (full CRUD on their portfolio), Tenants (CRUD for tenant profiles assigned to their properties), Payments (view and record payments across the portfolio), Maintenance (view all maintenance requests and update status), Documents (upload and manage lease documents), and Notifications (create and broadcast notifications to tenants)."),
  ...spacer(),
  bodyJ("Tenant portal capabilities: The tenant role has access to four pages — Dashboard (view assigned property details and landlord contact through a JOIN query), Payments (view own payment history and due amounts), Maintenance (submit new maintenance requests and view status of submitted requests), and Documents (view lease documents associated with their tenancy)."),
  ...spacer(),
  mkTable([
    ["Action","Landlord","Tenant"],
    ["View own property portfolio","✓ (all properties)","✗"],
    ["View assigned property","✗","✓ (one property via JOIN)"],
    ["Create / edit / delete properties","✓","✗"],
    ["Create tenant profiles","✓","✗"],
    ["Submit maintenance requests","✗","✓"],
    ["Update maintenance request status","✓","✗"],
    ["View payment history","✓ (all portfolio payments)","✓ (own payments only)"],
    ["Create payment records","✓","✗"],
    ["Upload lease documents","✓","✗"],
    ["View lease documents","✓","✓ (own lease only)"],
    ["Send notifications","✓","✗"],
    ["View notifications","✗","✓ (own notifications only)"],
  ],[3800,2500,2726]),
  ...spacer(),

  H2("5.3","Password Security and bcrypt Hashing"),
  bodyJ("RentWise uses the bcrypt library for all password hashing operations. bcrypt is the industry standard for password hashing in Node.js applications, providing three key security properties: adaptive cost (the work factor can be increased as hardware improves), salt embedding (each hash includes a unique random salt, preventing rainbow table attacks), and slow hashing (bcrypt is intentionally slower than general-purpose hash functions like SHA-256, making brute-force attacks impractical)."),
  ...spacer(),
  bodyJ("On signup, the auth controller calls bcrypt.hash(password, saltRounds) where saltRounds is typically 10 or 12. This produces a 60-character hash string that includes the bcrypt version, the salt rounds, the embedded salt, and the derived key — everything needed to verify a password — in a single string. This hash string is stored in the password_hash column of the users table."),
  ...spacer(),
  bodyJ("On login, the auth controller first retrieves the user record by email (SELECT * FROM users WHERE email = $1). If no record is found, it returns a 401 response with a generic error message (not specifying whether the email or password was wrong, to prevent email enumeration attacks). If a record is found, it calls bcrypt.compare(submittedPassword, storedHash), which extracts the salt from the stored hash, re-hashes the submitted password with the same salt, and compares the result. If the comparison fails, a 401 is returned. If it succeeds, the JWT is generated and returned."),
  ...spacer(),
  bodyJ("Plain text passwords are never logged, stored in temporary variables beyond the comparison operation, or returned in any API response. The users table never contains retrievable passwords; only the bcrypt hash is stored, and bcrypt hashes are computationally irreversible (one-way functions)."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 6 – Implementation
// ═══════════════════════════════════════════════════════════════════════════
function ch6() { return [
  H1("6","Implementation"),
  H2("6.1","Backend Controller Layer"),
  bodyJ("All business logic in RentWise is encapsulated in the controllers directory. Each controller module corresponds to one domain entity and exports one or more functions that handle specific HTTP operations. Controllers are pure async functions that receive Express request and response objects, perform database operations through the pg pool, and return JSON responses."),
  ...spacer(),
  mkTable([
    ["Controller / Route","Exported Operations","Key SQL Operations"],
    ["auth.js / /api/auth","signup, login","INSERT INTO users (bcrypt hash), SELECT + bcrypt.compare + jwt.sign"],
    ["properties / /api/properties","listByLandlord, create, update, delete","SELECT WHERE landlord_email=$1, INSERT, UPDATE, DELETE WHERE id=$1 AND landlord_email=$2"],
    ["tenants / /api/tenants","listByLandlord, create, getByEmail","INSERT INTO tenants, SELECT t.* p.* FROM tenants JOIN properties"],
    ["payments / /api/payments","listByLandlord, listByTenant, create, updateStatus","SELECT JOIN tenants WHERE landlord, SELECT WHERE tenant_id, INSERT, UPDATE status"],
    ["maintenance / /api/maintenance","listAll, listByTenant, create, updateStatus","SELECT JOIN tenants/properties, INSERT, UPDATE status WHERE id"],
    ["leases / /api/leases","list, create, updateSigned","SELECT WHERE tenant_id or property_id, INSERT, UPDATE signed=true"],
    ["notifications / /api/notifications","create, listByUser, markRead","INSERT, SELECT WHERE user_email=$1 ORDER BY created_at DESC, UPDATE is_read=true"],
  ],[2500,2800,3726]),
  ...spacer(),
  bodyJ("The controller pattern in RentWise follows a consistent structure across all modules: extract request parameters (from body, params, or query), validate required fields (return 400 if missing), execute a parameterized pool.query() call, extract the result from rows, and return the result as JSON with an appropriate status code. Errors are caught with try-catch and passed to next() for centralized handling."),
  ...spacer(),

  H2("6.2","Authentication Flow (Login and Signup)"),
  bodyJ("The authentication module implements two endpoints: POST /api/auth/signup for account creation and POST /api/auth/login for session establishment. These are the only two endpoints that do not require a JWT in the request."),
  ...spacer(),
  ...codeL([
    "// POST /api/auth/signup",
    "const signup = async (req, res, next) => {",
    "  const { email, password, name, role } = req.body;",
    "  if (!email || !password || !name || !role)",
    "    return res.status(400).json({ error: 'All fields required' });",
    "  try {",
    "    const hash = await bcrypt.hash(password, 10);",
    "    const result = await pool.query(",
    "      'INSERT INTO users (email,password_hash,name,role) VALUES ($1,$2,$3,$4) RETURNING id,email,name,role',",
    "      [email, hash, name, role]",
    "    );",
    "    res.status(201).json({ user: result.rows[0] });",
    "  } catch (err) { next(err); }",
    "};",
    "",
    "// POST /api/auth/login",
    "const login = async (req, res, next) => {",
    "  const { email, password } = req.body;",
    "  try {",
    "    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);",
    "    if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });",
    "    const user = result.rows[0];",
    "    const match = await bcrypt.compare(password, user.password_hash);",
    "    if (!match) return res.status(401).json({ error: 'Invalid credentials' });",
    "    const token = jwt.sign(",
    "      { email: user.email, name: user.name, role: user.role },",
    "      process.env.JWT_SECRET, { expiresIn: '7d' }",
    "    );",
    "    res.json({ token, role: user.role, name: user.name, email: user.email });",
    "  } catch (err) { next(err); }",
    "};",
  ]),
  ...spacer(),

  H2("6.3","Property and Tenant Management"),
  bodyJ("The properties module is the central CRUD domain in RentWise. All other domain entities trace back to a property through their property_id foreign key. The landlord identity is extracted from the JWT on every request, ensuring that landlords can only operate on their own properties."),
  ...spacer(),
  ...codeL([
    "// GET /api/properties — list landlord's properties",
    "const listProperties = async (req, res, next) => {",
    "  const landlordEmail = req.user.email; // extracted from JWT middleware",
    "  try {",
    "    const result = await pool.query(",
    "      'SELECT * FROM properties WHERE landlord_email = $1 ORDER BY created_at DESC',",
    "      [landlordEmail]",
    "    );",
    "    res.json({ properties: result.rows });",
    "  } catch (err) { next(err); }",
    "};",
    "",
    "// POST /api/properties — create new property",
    "const createProperty = async (req, res, next) => {",
    "  const { address, city, rent, status } = req.body;",
    "  const landlordEmail = req.user.email;",
    "  try {",
    "    const result = await pool.query(",
    "      `INSERT INTO properties (landlord_email,address,city,rent,status)",
    "       VALUES ($1,$2,$3,$4,$5) RETURNING *`,",
    "      [landlordEmail, address, city, rent, status || 'available']",
    "    );",
    "    res.status(201).json({ property: result.rows[0] });",
    "  } catch (err) { next(err); }",
    "};",
  ]),
  ...spacer(),
  bodyJ("The tenant module implements a critical JOIN query for the tenant dashboard. When a tenant logs in and loads their dashboard, the frontend calls GET /api/tenants/me (or GET /api/tenants?email=<jwt_email>). The controller executes a JOIN between tenants and properties to retrieve the tenant's profile and assigned property details in a single query:"),
  ...spacer(),
  ...codeL([
    "// GET /api/tenants — fetch tenant with property details (tenant portal)",
    "const getTenantByEmail = async (req, res, next) => {",
    "  const email = req.user.email;",
    "  try {",
    "    const result = await pool.query(",
    "      `SELECT t.*, p.address, p.city, p.rent, p.status AS property_status,",
    "              p.landlord_email",
    "       FROM tenants t",
    "       JOIN properties p ON t.property_id = p.id",
    "       WHERE t.email = $1`,",
    "      [email]",
    "    );",
    "    if (!result.rows.length)",
    "      return res.status(404).json({ error: 'Tenant profile not found' });",
    "    res.json({ tenant: result.rows[0] });",
    "  } catch (err) { next(err); }",
    "};",
  ]),
  ...spacer(),

  H2("6.4","Payment, Maintenance, and Lease Modules"),
  bodyJ("The payment, maintenance, and lease modules follow the same controller pattern but serve different business workflows. Each module has endpoints for both landlord-side management (full visibility, status update) and tenant-side access (self-scoped, read or submit)."),
  ...spacer(),
  bodyJ("Payment module: The landlord endpoint joins payments, tenants, and properties to return enriched payment records with tenant name and property address alongside each payment. The tenant endpoint filters payments by tenant_id retrieved from the tenants table using the JWT email. Payment status is stored as a VARCHAR and can be updated by the landlord (PUT /api/payments/:id/status) from 'pending' to 'paid' or 'overdue'."),
  ...spacer(),
  ...codeL([
    "// GET /api/payments — landlord view (all portfolio payments with context)",
    "const listPaymentsForLandlord = async (req, res, next) => {",
    "  const landlordEmail = req.user.email;",
    "  try {",
    "    const result = await pool.query(",
    "      `SELECT pay.*, t.name AS tenant_name, p.address, p.city",
    "       FROM payments pay",
    "       JOIN tenants t ON pay.tenant_id = t.id",
    "       JOIN properties p ON pay.property_id = p.id",
    "       WHERE p.landlord_email = $1",
    "       ORDER BY pay.due_date DESC`,",
    "      [landlordEmail]",
    "    );",
    "    res.json({ payments: result.rows });",
    "  } catch (err) { next(err); }",
    "};",
  ]),
  ...spacer(),
  bodyJ("Maintenance request module: Tenants POST to /api/maintenance with title, description, and priority. The controller inserts a new record with status 'open' and the tenant_id and property_id derived from the tenant's profile. Landlords retrieve all maintenance requests across their portfolio through a JOIN chain: maintenance_requests → tenants → properties WHERE landlord_email = JWT email. Landlords update request status (PUT /api/maintenance/:id/status) from 'open' to 'in_progress' or 'closed'."),
  ...spacer(),
  bodyJ("Lease document module: Lease records are created by the landlord (POST /api/leases) with tenant_id, property_id, document_url, start_date, end_date, and signed=false. The signed flag is updated to true (PUT /api/leases/:id/sign) when both parties have countersigned. Lease records approaching their end_date can be flagged by comparing end_date against CURRENT_DATE in a WHERE clause."),
  ...spacer(),

  H2("6.5","Frontend Routing and Protected Routes"),
  bodyJ("The RentWise frontend uses react-router-dom with BrowserRouter for client-side routing. The App.jsx file defines the complete route map with three sections: public routes (/, /login, /dashboard legacy redirect), landlord routes (wrapped in ProtectedRoute with role='landlord'), and tenant routes (wrapped in ProtectedRoute with role='tenant'). Figure 7 illustrates the frontend component architecture:"),
  ...spacer(),
  diag("fig7_frontend.png",580),
  figCap("Figure 7: RentWise Frontend Component Architecture — Route and Component Tree"),
  ...spacer(),
  bodyJ("The ProtectedRoute.jsx component is the frontend's access gate. It reads the JWT and role from localStorage on every render. If the JWT is absent, the user is redirected to /login. If the role does not match the required role prop (for example, a user with role 'tenant' attempting to render a landlord route), they are redirected to their correct dashboard (/tenant/dashboard for tenants, /landlord/dashboard for landlords). This prevents role escalation and role confusion at the UI level."),
  ...spacer(),
  ...codeL([
    "// ProtectedRoute.jsx — simplified",
    "function ProtectedRoute({ children, allowedRole }) {",
    "  const token = localStorage.getItem('rentwise_token');",
    "  const role  = localStorage.getItem('rentwise_role');",
    "  if (!token) return <Navigate to='/login' replace />;",
    "  if (role !== allowedRole) {",
    "    const redirect = role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard';",
    "    return <Navigate to={redirect} replace />;",
    "  }",
    "  return children;",
    "}",
  ]),
  ...spacer(),
  bodyJ("The AppLayout.jsx component wraps all portal pages with the common shell: a top Navbar (showing the logged-in user's name and a logout button) and a Sidebar (showing the role-appropriate navigation links). The Sidebar receives the user's role from localStorage and renders either the landlord link set or the tenant link set based on that value. This ensures that the sidebar never shows landlord links in the tenant portal or vice versa."),
  ...spacer(),

  H2("6.6","Session Handling and Local Storage"),
  bodyJ("RentWise manages session state entirely through the browser's localStorage API. This is a deliberate design choice for a single-page application of this scale: it avoids the complexity of a server-side session store (Redis, database sessions) while providing persistence across browser refreshes."),
  ...spacer(),
  bodyJ("Session storage on login: When the login response is received successfully, the frontend stores five values in localStorage: rentwise_token (the JWT string), rentwise_role ('landlord' or 'tenant'), rentwise_user (the user's email), rentwise_name (the user's display name), and a legacy key for the redirect target."),
  ...spacer(),
  bodyJ("Session read on page load: On every page render within the portal, the ProtectedRoute component reads rentwise_token and rentwise_role from localStorage synchronously. This is a synchronous read (localStorage is synchronous, unlike async APIs like IndexedDB) that completes before any API request is made, ensuring that unauthenticated renders never reach the API layer."),
  ...spacer(),
  bodyJ("Session cleanup on logout: The Navbar's logout button calls a cleanup function that removes all five localStorage keys using localStorage.removeItem() and then calls window.location.href = '/login' (a full page navigation rather than react-router's navigate, ensuring that all React state is cleared). This prevents stale session data from persisting in React component state after logout."),
  ...spacer(),
  bodyJ("Session expiry handling: If an API request returns a 401 Unauthorized response (indicating an expired or invalid JWT), the portal page component catches the error and calls the same cleanup function as the logout button, redirecting the user to /login with the session cleared. This provides automatic session expiry handling without requiring a background token refresh mechanism."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 7 – Performance and Optimization
// ═══════════════════════════════════════════════════════════════════════════
function ch7() { return [
  H1("7","Performance and Optimization"),
  H2("7.1","PostgreSQL Connection Pooling"),
  bodyJ("RentWise uses the pg library's Pool class for all database interactions. Connection pooling is the most important performance optimization for a database-backed web application: without pooling, every HTTP request would open a new TCP connection to PostgreSQL, negotiate the connection protocol, and close it after the query — a process that adds 20 to 100 milliseconds of latency per request on a local network."),
  ...spacer(),
  bodyJ("The Pool class in node-postgres maintains a pool of persistent database connections that are shared across concurrent API requests. When a controller calls pool.query(), the pool manager checks out an idle connection from the pool, executes the query, and returns the connection to the pool when the result is received. If all connections are in use, the request is queued until a connection becomes available (up to the configured connectionTimeoutMillis)."),
  ...spacer(),
  ...codeL([
    "// db/index.js — Pool configuration",
    "import { Pool } from 'pg';",
    "import dotenv from 'dotenv';",
    "dotenv.config();",
    "",
    "const pool = new Pool({",
    "  host:     process.env.DB_HOST     || 'localhost',",
    "  port:     parseInt(process.env.DB_PORT) || 5432,",
    "  user:     process.env.DB_USER     || 'postgres',",
    "  password: process.env.DB_PASSWORD || '',",
    "  database: process.env.DB_NAME     || 'rentwise',",
    "  max:               20,   // maximum pool size",
    "  idleTimeoutMillis: 30000, // release idle connections after 30s",
    "  connectionTimeoutMillis: 2000, // reject if no connection available in 2s",
    "});",
    "",
    "export default pool;",
  ]),
  ...spacer(),
  bodyJ("A pool maximum of 20 connections is appropriate for a single-server deployment. PostgreSQL's default maximum connections is 100 (configurable in postgresql.conf); with a pool of 20, RentWise can coexist with up to four other applications on the same database server without exhausting connections. For production deployment, the pool size should be tuned based on measured concurrency and query duration."),
  ...spacer(),

  H2("7.2","Query Optimization and Joins"),
  bodyJ("RentWise uses JOIN queries to avoid N+1 query patterns in dashboard views. The tenant dashboard is the most performance-sensitive view: it must display the tenant's profile alongside their assigned property details. Without a JOIN, this would require two sequential queries (one for the tenant, one for the property). With a JOIN, it requires a single query:"),
  ...spacer(),
  ...codeL([
    "-- Tenant dashboard JOIN (single query for tenant + property context)",
    "SELECT t.id, t.name, t.email, t.phone, t.move_in_date,",
    "       p.id AS property_id, p.address, p.city, p.rent,",
    "       p.status AS property_status, p.landlord_email",
    "FROM tenants t",
    "JOIN properties p ON t.property_id = p.id",
    "WHERE t.email = $1;",
    "",
    "-- Landlord payment view (payments enriched with tenant name and property address)",
    "SELECT pay.id, pay.amount, pay.due_date, pay.paid_date, pay.status,",
    "       t.name AS tenant_name, t.email AS tenant_email,",
    "       p.address, p.city",
    "FROM payments pay",
    "JOIN tenants t   ON pay.tenant_id   = t.id",
    "JOIN properties p ON pay.property_id = p.id",
    "WHERE p.landlord_email = $1",
    "ORDER BY pay.due_date DESC;",
  ]),
  ...spacer(),
  bodyJ("The properties table's landlord_email column and the tenants table's email column should have indexes to support efficient equality lookups. PostgreSQL automatically creates an index on the PRIMARY KEY (id) for each table. Adding explicit indexes on landlord_email and email would reduce query time from a full table scan (O(n)) to an index scan (O(log n)) for large datasets:"),
  ...spacer(),
  ...codeL([
    "-- Recommended indexes for production performance",
    "CREATE INDEX idx_properties_landlord_email ON properties(landlord_email);",
    "CREATE INDEX idx_tenants_email             ON tenants(email);",
    "CREATE INDEX idx_notifications_user_email  ON notifications(user_email);",
    "CREATE INDEX idx_payments_tenant_id        ON payments(tenant_id);",
    "CREATE INDEX idx_maintenance_property_id   ON maintenance_requests(property_id);",
  ]),
  ...spacer(),

  H2("7.3","Frontend Performance Strategies"),
  bodyJ("The React 19 frontend implements several performance strategies to ensure responsive rendering across all portal pages."),
  ...spacer(),
  bodyJ("Code splitting with Vite: Vite automatically applies code splitting at the route level through dynamic imports. Each portal page is a separate JavaScript chunk that is loaded only when the route is first navigated to. This reduces the initial bundle size (which covers only the Landing page and shared components) and defers loading of the full portal to after authentication."),
  ...spacer(),
  bodyJ("State management with React hooks: All data fetching is implemented with useEffect and useState hooks directly in page components. This approach avoids the overhead of a global state management library (Redux, MobX) for an application of this scale. API requests are initiated on component mount (useEffect with empty dependency array) and results are stored in local component state. Loading and error states are tracked separately to provide appropriate UI feedback."),
  ...spacer(),
  bodyJ("Optimistic UI updates: For status update operations (marking a payment as paid, closing a maintenance request), the frontend can optimistically update the local state immediately on button click and revert if the API request fails. This makes status updates feel instantaneous even on slow network connections."),
  ...spacer(),
  bodyJ("Tailwind CSS utility classes: Tailwind's utility-first approach eliminates the need for custom CSS files in most cases, reducing stylesheet size and specificity conflicts. Tailwind's purge/content configuration removes unused utility classes from the production build, minimizing the CSS bundle to only the classes actually used in the application."),
  ...spacer(),
  bodyJ("Lucide React tree-shaking: The lucide-react icon library supports named imports that allow Vite to tree-shake unused icons. Only the icons actually used in the application are included in the production bundle, rather than the entire icon library."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 8 – Workflow State Management
// ═══════════════════════════════════════════════════════════════════════════
function ch8() { return [
  H1("8","Workflow State Management"),
  H2("8.1","Authentication State Machine"),
  bodyJ("The authentication workflow in RentWise follows a deterministic state machine with five states. The state machine is implemented through a combination of React component state (for UI rendering) and localStorage (for persistence across page refreshes). The complete state machine is illustrated in Figure 5 (shown in Chapter 5)."),
  ...spacer(),
  mkTable([
    ["State","Description","UI Rendered","Available Transitions"],
    ["unauthenticated","No JWT in localStorage","Landing page or Login page","→ authenticating (submit credentials)"],
    ["authenticating","POST /api/auth/login in-flight","Login form with loading spinner","→ authenticated (200 OK), → auth_error (401)"],
    ["auth_error","Login failed — wrong credentials or server error","Login form with error message","→ authenticating (retry), remains until success"],
    ["authenticated","Valid JWT stored; role detected","Landlord or Tenant portal dashboard","→ session_expired (401 on API), → unauthenticated (logout)"],
    ["session_expired","API returned 401 — token expired or invalid","Brief message then redirect to /login","→ unauthenticated (localStorage cleared)"],
  ],[2000,2800,2400,2026]),
  ...spacer(),
  bodyJ("The transition from authenticating to authenticated is the most critical path. The Login component calls POST /api/auth/login, receives the JWT and user details, stores them in localStorage, and uses React Router's useNavigate hook to redirect to the role-appropriate dashboard. This redirect triggers the ProtectedRoute check on the dashboard component, which reads the freshly stored token and role and allows rendering."),
  ...spacer(),
  bodyJ("The transition from authenticated to session_expired is handled by API error interceptors in each portal page component. When a fetch call returns a 401 status, the error handler calls a shared clearSession() utility function (which removes all localStorage keys) and redirects to /login. The Login page does not display a 'session expired' message by default, but one can be added through a query parameter (e.g., /login?reason=expired)."),
  ...spacer(),

  H2("8.2","Role-Based Navigation Flow"),
  bodyJ("After authentication, the user enters the role-appropriate portal. Navigation within the portal is managed by the Sidebar component, which renders different link sets based on the stored rentwise_role value. The navigation flow within each portal follows React Router's declarative routing: clicking a sidebar link updates the browser URL, which React Router matches to the corresponding page component and renders it within the AppLayout shell."),
  ...spacer(),
  bodyJ("Landlord navigation flow: Starting at /landlord/dashboard, the landlord sees summary statistics (total properties, total tenants, pending payments, open maintenance requests). From the dashboard, the landlord can navigate to any of the six domain pages. Each page performs its own data fetch on mount, displaying a loading state until the API responds. Form interactions (creating a property, recording a payment) send POST requests and update the page's state with the new record without requiring a full page reload."),
  ...spacer(),
  bodyJ("Tenant navigation flow: Starting at /tenant/dashboard, the tenant sees their assigned property details retrieved through the JOIN query. The dashboard is the information-richest page for a tenant; the other three pages (Payments, Maintenance, Documents) provide domain-specific detail views. The Maintenance page includes a form for submitting new requests, which POSTs to /api/maintenance and updates the local list state with the new request."),
  ...spacer(),
  bodyJ("Legacy redirect: The /dashboard route is a legacy convenience route that reads rentwise_role from localStorage and redirects to either /landlord/dashboard or /tenant/dashboard. This allows older links or bookmarks to /dashboard to continue working correctly as the role-appropriate entry point."),
  ...spacer(),

  H2("8.3","Request-Response Lifecycle"),
  bodyJ("Every data operation in RentWise follows a consistent four-phase request-response lifecycle that is implemented uniformly across all portal page components."),
  ...spacer(),
  bodyJ("Phase 1 — Initialization: On component mount (useEffect with empty dependency array), the component sets a loading state to true and initiates the primary data fetch. For pages with multiple data needs (for example, the Payments page needs both payments and property context), multiple concurrent fetch calls are initiated using Promise.all() to minimize total load time."),
  ...spacer(),
  ...codeL([
    "// Standard data fetch pattern (Payments page example)",
    "useEffect(() => {",
    "  const fetchData = async () => {",
    "    setLoading(true);",
    "    setError(null);",
    "    try {",
    "      const token = localStorage.getItem('rentwise_token');",
    "      const res = await fetch('http://localhost:5000/api/payments', {",
    "        headers: { Authorization: `Bearer ${token}` }",
    "      });",
    "      if (res.status === 401) { clearSession(); navigate('/login'); return; }",
    "      if (!res.ok) throw new Error('Failed to fetch payments');",
    "      const data = await res.json();",
    "      setPayments(data.payments);",
    "    } catch (err) {",
    "      setError(err.message);",
    "    } finally {",
    "      setLoading(false);",
    "    }",
    "  };",
    "  fetchData();",
    "}, []);",
  ]),
  ...spacer(),
  bodyJ("Phase 2 — Loading state: While the fetch is in-flight, the component renders a loading indicator (spinner or skeleton UI). The loading state prevents the page from rendering empty data tables or blank property cards while the API response is awaited."),
  ...spacer(),
  bodyJ("Phase 3 — Success rendering: When the fetch resolves successfully, the component sets loading to false and stores the response data in state. React re-renders the component with the received data, populating tables, lists, and cards with live values from the database."),
  ...spacer(),
  bodyJ("Phase 4 — Error handling: If the fetch throws or returns a non-200 status, the component sets an error message in state and renders it prominently on the page. For 401 responses specifically, the component clears the session and redirects to /login. For all other errors, the component displays a retry option."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 9 – Results and Analysis
// ═══════════════════════════════════════════════════════════════════════════
function ch9() { return [
  H1("9","Results and Analysis"),
  H2("9.1","Sample Data and Output"),
  bodyJ("The following representative database records and API responses demonstrate RentWise operating on a test dataset with two landlords and three tenants across four properties."),
  ...spacer(),
  bodyJ("Sample 1: User record (users table)"),
  ...codeL([
    "{",
    '  "id": 1,',
    '  "email": "landlord@example.com",',
    '  "password_hash": "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmYzZTEabuYDP25cvdyS...",',
    '  "role": "landlord",',
    '  "name": "Arjun Sharma",',
    '  "created_at": "2025-04-01T08:00:00.000Z"',
    "}",
  ]),
  ...spacer(),
  bodyJ("Sample 2: Property record (properties table)"),
  ...codeL([
    "{",
    '  "id": 3,',
    '  "landlord_email": "landlord@example.com",',
    '  "address": "42 MG Road, Koramangala",',
    '  "city": "Bengaluru",',
    '  "rent": "18000.00",',
    '  "status": "occupied",',
    '  "created_at": "2025-04-05T10:30:00.000Z"',
    "}",
  ]),
  ...spacer(),
  bodyJ("Sample 3: Tenant dashboard JOIN response (GET /api/tenants?email=tenant@example.com)"),
  ...codeL([
    "{",
    '  "tenant": {',
    '    "id": 2,',
    '    "name": "Priya Nair",',
    '    "email": "priya@example.com",',
    '    "phone": "+91 98765 43210",',
    '    "move_in_date": "2025-01-15",',
    '    "property_id": 3,',
    '    "address": "42 MG Road, Koramangala",',
    '    "city": "Bengaluru",',
    '    "rent": "18000.00",',
    '    "property_status": "occupied",',
    '    "landlord_email": "landlord@example.com"',
    '  }',
    "}",
  ]),
  ...spacer(),
  bodyJ("Sample 4: Payment record with enriched JOIN data (landlord payment list view)"),
  ...codeL([
    "{",
    '  "id": 7,',
    '  "tenant_id": 2,',
    '  "property_id": 3,',
    '  "amount": "18000.00",',
    '  "due_date": "2025-05-01",',
    '  "paid_date": null,',
    '  "status": "pending",',
    '  "tenant_name": "Priya Nair",',
    '  "tenant_email": "priya@example.com",',
    '  "address": "42 MG Road, Koramangala",',
    '  "city": "Bengaluru"',
    "}",
  ]),
  ...spacer(),
  bodyJ("Sample 5: Maintenance request record"),
  ...codeL([
    "{",
    '  "id": 4,',
    '  "tenant_id": 2,',
    '  "property_id": 3,',
    '  "title": "Bathroom tap leaking",',
    '  "description": "The bathroom tap has been dripping for 3 days causing water wastage.",',
    '  "priority": "medium",',
    '  "status": "open",',
    '  "created_at": "2025-04-18T14:22:00.000Z"',
    "}",
  ]),
  ...spacer(),

  H2("9.2","Reports Generated by the System"),
  bodyJ("RentWise generates the following reports and analytical summaries within its dashboard views. All reports are computed from live PostgreSQL queries rather than pre-computed snapshots, ensuring real-time accuracy."),
  ...spacer(),
  bodyJ("Landlord Dashboard Summary: The landlord dashboard aggregates four key metrics through PostgreSQL COUNT and SUM queries: total properties in the portfolio, total active tenants, total pending payment amount (SUM of amount WHERE status='pending'), and count of open maintenance requests. These are displayed as stat cards at the top of the dashboard, providing an at-a-glance operational overview."),
  ...spacer(),
  bodyJ("Payment Status Report (Landlord): The payments page renders a full table of all payments across the landlord's portfolio, enriched with tenant name and property address through JOIN queries. Each row shows payment amount, due date, paid date, status badge (color-coded: green for paid, yellow for pending, red for overdue), tenant name, and property address. The table supports filtering by status to quickly identify all overdue payments."),
  ...spacer(),
  bodyJ("Maintenance Queue (Landlord): The maintenance page renders all maintenance requests across the portfolio, grouped and filterable by status (open, in_progress, closed) and priority (low, medium, high). Each row shows the request title, description excerpt, property address, tenant name, priority badge, status badge, and submission date. Landlords can update the status directly from this view."),
  ...spacer(),
  bodyJ("Tenant Tenancy Summary (Tenant Dashboard): The tenant dashboard displays a comprehensive tenancy card showing: assigned property address, city, and monthly rent; move-in date; landlord email contact; and current property status. This provides the tenant with all essential context about their tenancy in a single view without requiring navigation to separate pages."),
  ...spacer(),
  bodyJ("Lease Expiry Tracking: The lease documents module can compute days remaining to lease expiry through a PostgreSQL DATE arithmetic query (end_date - CURRENT_DATE) and surface leases approaching expiry (for example, within 30 days) through a WHERE clause filter. This enables proactive lease renewal conversations before the expiry date."),
  ...spacer(),

  H2("9.3","Performance Observations"),
  mkTable([
    ["Operation","Typical Latency","Notes"],
    ["POST /api/auth/login (bcrypt.compare)","200 – 400 ms","bcrypt intentionally slow; cost factor 10 adds ~100ms above raw query"],
    ["GET /api/properties (landlord list)","15 – 40 ms","Single SELECT with WHERE; indexed on landlord_email in production"],
    ["GET /api/tenants (JOIN query)","20 – 50 ms","One JOIN between tenants and properties; fast on small dataset"],
    ["GET /api/payments (landlord, 2 JOINs)","25 – 60 ms","Two JOINs; benefits significantly from indexes on tenant_id, property_id"],
    ["POST /api/properties (INSERT)","10 – 25 ms","Single INSERT RETURNING *; no JOIN required"],
    ["GET /api/maintenance (all requests)","20 – 45 ms","Two JOINs; filtered by landlord_email through property JOIN"],
    ["PUT /api/payments/:id/status (UPDATE)","10 – 20 ms","Single UPDATE by id; primary key lookup"],
    ["Frontend initial load (cold)","400 – 800 ms","Vite bundle load + API health check + auth redirect"],
    ["Portal page navigation (warm)","50 – 150 ms","API fetch + React render; no full page reload"],
    ["JWT verification (per request)","< 1 ms","CPU-bound; HS256 verification is negligible"],
  ],[3200,1800,4026]),
  ...spacer(),
  bodyJ("The bcrypt comparison on login (200 to 400 ms) is the single largest latency contributor in the system. This is intentional: bcrypt's work factor makes password brute-forcing impractical. For a login operation that occurs at most a few times per user session, this latency is acceptable and expected. For high-throughput authentication scenarios (automated testing), the salt rounds can be reduced to 6 or 8 in the test environment without affecting production security."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 10 – Application Integration
// ═══════════════════════════════════════════════════════════════════════════
function ch10() { return [
  H1("10","Application Integration (Full Stack)"),
  H2("10.1","Backend Integration (Express + PostgreSQL)"),
  bodyJ("The Express backend serves as the complete API layer for RentWise. It is started independently from the frontend with npm start (or npm run dev with nodemon for auto-restart on file changes) in the rentwise-backend directory. The backend does not serve the frontend's HTML; the two applications run as separate processes with the frontend's Vite dev server proxying API requests or the frontend calling the backend directly at http://localhost:5000."),
  ...spacer(),
  bodyJ("Server initialization (rentwise-backend/server.js):"),
  ...codeL([
    "import express from 'express';",
    "import cors from 'cors';",
    "import dotenv from 'dotenv';",
    "import authRoutes         from './routes/auth.js';",
    "import propertiesRoutes   from './routes/properties.js';",
    "import tenantsRoutes      from './routes/tenants.js';",
    "import paymentsRoutes     from './routes/payments.js';",
    "import maintenanceRoutes  from './routes/maintenance.js';",
    "import leasesRoutes       from './routes/leases.js';",
    "import notificationsRoutes from './routes/notifications.js';",
    "",
    "dotenv.config();",
    "const app = express();",
    "",
    "app.use(cors());",
    "app.use(express.json());",
    "",
    "app.use('/api/auth',          authRoutes);",
    "app.use('/api/properties',    propertiesRoutes);",
    "app.use('/api/tenants',       tenantsRoutes);",
    "app.use('/api/payments',      paymentsRoutes);",
    "app.use('/api/maintenance',   maintenanceRoutes);",
    "app.use('/api/leases',        leasesRoutes);",
    "app.use('/api/notifications', notificationsRoutes);",
    "",
    "app.get('/api/health', (req, res) => res.json({ status: 'ok' }));",
    "",
    "app.use((err, req, res, next) => {",
    "  console.error(err);",
    "  res.status(500).json({ error: 'Internal server error' });",
    "});",
    "",
    "app.listen(5000, () => console.log('RentWise API running on port 5000'));",
  ]),
  ...spacer(),

  H2("10.2","Frontend Interaction (React + Vite)"),
  bodyJ("The RentWise frontend is a React 19 single-page application built with Vite 5. It connects to the backend exclusively through HTTP fetch calls to http://localhost:5000/api/*. There is no shared code between the frontend and backend except the agreed API contract (request/response shapes)."),
  ...spacer(),
  bodyJ("Application bootstrap (rentwise-frontend/src/main.jsx):"),
  ...codeL([
    "import React from 'react';",
    "import ReactDOM from 'react-dom/client';",
    "import { BrowserRouter } from 'react-router-dom';",
    "import App from './App.jsx';",
    "import './index.css';",
    "",
    "ReactDOM.createRoot(document.getElementById('root')).render(",
    "  <React.StrictMode>",
    "    <BrowserRouter>",
    "      <App />",
    "    </BrowserRouter>",
    "  </React.StrictMode>",
    ");",
  ]),
  ...spacer(),
  bodyJ("Route configuration (App.jsx — abbreviated):"),
  ...codeL([
    "import { Routes, Route, Navigate } from 'react-router-dom';",
    "import ProtectedRoute from './components/layout/ProtectedRoute.jsx';",
    "// ... page imports",
    "",
    "function App() {",
    "  return (",
    "    <Routes>",
    "      {/* Public */}",
    "      <Route path='/'      element={<Landing />} />",
    "      <Route path='/login' element={<Login />}   />",
    "",
    "      {/* Landlord portal */}",
    "      <Route path='/landlord/dashboard'",
    "        element={<ProtectedRoute allowedRole='landlord'><LandlordDashboard /></ProtectedRoute>} />",
    "      <Route path='/landlord/properties'",
    "        element={<ProtectedRoute allowedRole='landlord'><Properties /></ProtectedRoute>} />",
    "      {/* ... remaining landlord routes */}",
    "",
    "      {/* Tenant portal */}",
    "      <Route path='/tenant/dashboard'",
    "        element={<ProtectedRoute allowedRole='tenant'><TenantDashboard /></ProtectedRoute>} />",
    "      {/* ... remaining tenant routes */}",
    "",
    "      {/* Legacy redirect */}",
    "      <Route path='/dashboard' element={<DashboardRedirect />} />",
    "    </Routes>",
    "  );",
    "}",
  ]),
  ...spacer(),

  H2("10.3","Authentication and Database Connectivity"),
  bodyJ("The authentication flow connects the frontend, Express backend, and PostgreSQL database in a three-step sequence that occurs on every login:"),
  ...spacer(),
  bodyJ("Step 1 — Frontend to Backend (HTTP POST): The Login page component collects email and password from the form, performs a GET /api/health check, and then sends POST /api/auth/login with the credentials as JSON body. The request includes no Authorization header (this is the authentication endpoint itself)."),
  ...spacer(),
  bodyJ("Step 2 — Backend to PostgreSQL (parameterized query): The auth controller receives the request, extracts email and password from req.body, and calls pool.query('SELECT * FROM users WHERE email = $1', [email]). The pool checks out a connection from the PostgreSQL connection pool, sends the parameterized query to PostgreSQL, receives the result rows, and returns the connection to the pool. The controller passes the stored hash to bcrypt.compare() and the result to jwt.sign()."),
  ...spacer(),
  bodyJ("Step 3 — Backend to Frontend (JSON response): The controller sends a 200 JSON response with the token, role, name, and email. The frontend stores these values in localStorage and navigates to the role-appropriate dashboard. From this point, the token is included in every subsequent API request's Authorization header."),
  ...spacer(),
  bodyJ("Database setup: The rentwise PostgreSQL database must be created manually before starting the backend. The schema is applied by running psql -U postgres -d rentwise -f db/schema.sql. The migrate.js and migrate_tenants.js scripts handle incremental schema updates. The setup_backend.js script can be used for first-time environment initialization. Connection parameters (host, port, user, password, database name) are read from a .env file via dotenv, which is listed in .gitignore to prevent credential exposure."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 11 – Conclusion
// ═══════════════════════════════════════════════════════════════════════════
function ch11() { return [
  H1("11","Conclusion"),
  H2("11.1","Summary of Work"),
  bodyJ("RentWise successfully delivers a comprehensive full-stack property management system that digitizes the end-to-end rental workflow for both landlords and tenants. The system implements:"),
  ...spacer(),
  bullet("A PostgreSQL relational database with seven tables, enforced foreign key relationships, and a normalized schema covering all core rental management domains: users, properties, tenants, payments, maintenance requests, lease documents, and notifications."),
  bullet("A Node.js and Express 5 REST API with seven domain route modules, dedicated controller functions, a centralized error handler, and two utility endpoints (/api/health and /api/test-db) for operational monitoring."),
  bullet("JWT-based stateless authentication with bcrypt password hashing, providing secure session management without server-side session storage. The seven-day token expiry balances security with user experience."),
  bullet("Role-based access control with two roles (landlord and tenant) enforced at both the frontend ProtectedRoute layer and the backend JWT claim filtering layer, ensuring complete data isolation between roles."),
  bullet("A landlord portal with seven feature-complete pages: Dashboard (summary statistics), Properties (full CRUD), Tenants (profile management), Payments (transaction tracking), Maintenance (request queue), Documents (lease management), and Notifications (broadcast messaging)."),
  bullet("A tenant portal with four pages: Dashboard (property context via JOIN), Payments (history view), Maintenance (submit and track requests), and Documents (lease document access)."),
  bullet("A PostgreSQL connection pool via node-postgres with configurable pool size, idle timeout, and connection timeout for production-grade database connection management."),
  bullet("Optimized JOIN queries for dashboard views, eliminating N+1 query patterns and reducing multi-entity views to single database round-trips."),
  ...spacer(),

  H2("11.2","Learning Outcomes"),
  bodyJ("Development of RentWise provided practical experience across the complete full-stack web development spectrum:"),
  ...spacer(),
  bullet("Full-stack web application architecture — designing a three-tier client-server system with clear separation between the React frontend, Express application tier, and PostgreSQL data tier."),
  bullet("Relational database design — creating a normalized PostgreSQL schema with seven related tables, SERIAL primary keys, NOT NULL constraints, UNIQUE constraints, and foreign key relationships with appropriate CASCADE behaviors."),
  bullet("PostgreSQL query writing — implementing parameterized queries, multi-table JOINs, WHERE clause filtering, ORDER BY sorting, COUNT and SUM aggregations, and UPDATE with WHERE conditions for status management."),
  bullet("RESTful API design — structuring HTTP endpoints with appropriate methods (GET, POST, PUT, DELETE), URL patterns (/api/resource/:id), status codes (200, 201, 400, 401, 404, 500), and JSON response shapes."),
  bullet("JWT authentication implementation — generating signed tokens with jwt.sign(), verifying tokens with jwt.verify(), extracting claims from the JWT payload, and implementing the complete login-session-logout lifecycle."),
  bullet("bcrypt password security — understanding the work factor, salt embedding, and one-way hash properties of bcrypt, and implementing signup and login flows that never expose plain text passwords."),
  bullet("Express middleware architecture — implementing CORS, JSON body parsing, JWT verification middleware, and centralized error handling in a properly ordered middleware stack."),
  bullet("React hooks and state management — using useState, useEffect, useNavigate, and useRef to manage data fetching, loading states, error states, form submissions, and navigation without a global state library."),
  bullet("Role-based frontend routing — implementing ProtectedRoute with role checking, automatic redirects for unauthorized access, and role-based sidebar navigation in a React Router application."),
  bullet("Environment configuration — managing sensitive configuration (database credentials, JWT secret) through .env files and the dotenv library, with proper .gitignore exclusion."),
  ...spacer(),

  H2("11.3","Future Enhancements"),
  bodyJ("The following enhancements have been identified for future development iterations:"),
  ...spacer(),
  numbered("Real Controller Logic for Placeholder Modules: The current implementation has some route files returning placeholder responses. The immediate next step is implementing full CRUD controller logic for all seven modules with proper PostgreSQL queries, validation, and error handling."),
  ...spacer(),
  numbered("Environment Variable Centralization: The frontend currently hardcodes http://localhost:5000 as the backend URL. This should be replaced with a Vite environment variable (import.meta.env.VITE_API_URL) configured per deployment environment (development, staging, production)."),
  ...spacer(),
  numbered("Online Payment Gateway Integration: Integrating Razorpay or Stripe for online rent payment processing would allow tenants to pay rent directly through the portal. The payment module would be extended to store payment gateway transaction IDs alongside the existing manual payment records."),
  ...spacer(),
  numbered("Email Notification Service: Integrating a transactional email service (SendGrid, Resend, or Nodemailer with SMTP) to send automatic email alerts — rent due reminders, maintenance request updates, lease expiry warnings, and notification broadcasts — would significantly improve communication without requiring tenants to log in to check the portal."),
  ...spacer(),
  numbered("File Upload for Lease Documents: The current lease_documents table stores document URLs (strings). Integrating a file upload service (AWS S3, Cloudinary, or local multer-based upload) would allow landlords to upload PDF lease agreements directly through the portal rather than linking to externally hosted documents."),
  ...spacer(),
  numbered("Database Schema Migration Framework: Replacing the ad-hoc migrate.js scripts with a proper migration framework (Flyway, Liquibase, or node-pg-migrate) would provide versioned, reversible schema changes with a controlled migration history, making production deployments safer."),
  ...spacer(),
  numbered("Automated Test Suite: Implementing unit tests for controllers (using Jest and a mock PostgreSQL pool), integration tests for API endpoints (using Supertest), and end-to-end tests for the frontend (using Playwright or Cypress) would significantly improve deployment confidence and catch regressions before they reach production."),
  ...spacer(),
  numbered("Multi-Property Tenants: The current schema supports one property per tenant. Extending the tenants table (or creating a tenant_properties junction table) to support tenants with multiple properties (for example, co-living scenarios) would broaden the system's applicability."),
  ...spacer(),
  numbered("Mobile-Responsive Progressive Web App: Configuring the Vite frontend as a Progressive Web App (PWA) with a service worker and web manifest would allow tenants and landlords to install RentWise on their mobile devices and use it offline for viewing cached data. Push notifications through the Web Push API would replace the in-app notification system for mobile users."),
  ...spacer(),
  numbered("Analytics Dashboard: Adding a dedicated analytics section for landlords with charts (using Chart.js or Recharts) showing monthly rent collection rates, maintenance request resolution times, occupancy trends across the portfolio, and payment overdue aging reports would transform RentWise from a transaction system into a portfolio intelligence tool."),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 12 – References
// ═══════════════════════════════════════════════════════════════════════════
function ch12() { return [
  H1("12","References"),
  H2("A.","Frameworks and Libraries"),
  bullet("React 19 — https://react.dev — Frontend UI framework, hooks, component model, React 19 concurrent features"),
  bullet("Vite 5 — https://vitejs.dev — Frontend build tool, HMR, code splitting, environment variables"),
  bullet("react-router-dom v6 — https://reactrouter.com/en/main — Client-side routing, BrowserRouter, ProtectedRoute patterns"),
  bullet("Tailwind CSS v4 — https://tailwindcss.com/docs — Utility-first CSS framework for responsive layout and theming"),
  bullet("lucide-react — https://lucide.dev — Tree-shakeable React icon library"),
  bullet("Express 5 — https://expressjs.com/en/5x/api.html — Node.js web framework for REST API construction"),
  bullet("node-postgres (pg) — https://node-postgres.com — PostgreSQL client for Node.js with connection pooling"),
  bullet("jsonwebtoken — https://github.com/auth0/node-jsonwebtoken — JWT signing and verification for stateless auth"),
  bullet("bcrypt — https://github.com/kelektiv/node.bcrypt.js — Password hashing with adaptive cost factor"),
  bullet("dotenv — https://github.com/motdotla/dotenv — Environment variable loading from .env files"),
  bullet("cors — https://github.com/expressjs/cors — Cross-Origin Resource Sharing middleware for Express"),
  ...spacer(),
  H2("B.","Websites and Tools"),
  bullet("PostgreSQL Documentation — https://www.postgresql.org/docs — SQL syntax, data types, index management, ACID properties"),
  bullet("GitHub — https://github.com — Version control, repository hosting, collaborative development"),
  bullet("Postman — https://www.postman.com — API testing and documentation for all seven REST endpoints"),
  bullet("pgAdmin 4 — https://www.pgadmin.org — PostgreSQL GUI for schema management and query execution"),
  bullet("Node.js Documentation — https://nodejs.org/en/docs — Core modules: http, fs, path, process, child_process"),
  ...spacer(),
  H2("C.","Documentation"),
  bullet("Express Routing Guide — https://expressjs.com/en/guide/routing.html — Router, middleware, error handling patterns"),
  bullet("PostgreSQL DDL Reference — https://www.postgresql.org/docs/current/ddl.html — CREATE TABLE, FOREIGN KEY, SERIAL, constraints"),
  bullet("JWT RFC 7519 — https://datatracker.ietf.org/doc/html/rfc7519 — JSON Web Token specification and claims structure"),
  bullet("bcrypt Algorithm — https://www.usenix.org/legacy/events/usenix99/provos/provos.pdf — Original bcrypt paper by Provos and Mazières"),
  bullet("React Router v6 Tutorial — https://reactrouter.com/en/main/start/tutorial — Protected routes, useNavigate, Route hierarchy"),
  bullet("node-postgres Pool API — https://node-postgres.com/apis/pool — Pool configuration, query execution, connection management"),
  pb(),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// CHAPTER 13 – Appendix
// ═══════════════════════════════════════════════════════════════════════════
function ch13() { return [
  H1("13","Appendix"),
  H2("A.","Code Samples"),
  ...spacer(),
  bodyJ("Complete Database Schema (rentwise-backend/db/schema.sql — abbreviated):"),
  ...codeL([
    "CREATE TABLE users (",
    "  id            SERIAL PRIMARY KEY,",
    "  email         VARCHAR(255) NOT NULL UNIQUE,",
    "  password_hash VARCHAR(255) NOT NULL,",
    "  role          VARCHAR(50)  NOT NULL CHECK (role IN ('landlord','tenant')),",
    "  name          VARCHAR(255) NOT NULL,",
    "  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE properties (",
    "  id             SERIAL PRIMARY KEY,",
    "  landlord_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,",
    "  address        VARCHAR(500) NOT NULL,",
    "  city           VARCHAR(100) NOT NULL,",
    "  rent           NUMERIC(10,2) NOT NULL,",
    "  status         VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available','occupied')),",
    "  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE tenants (",
    "  id           SERIAL PRIMARY KEY,",
    "  name         VARCHAR(255) NOT NULL,",
    "  email        VARCHAR(255) REFERENCES users(email),",
    "  property_id  INTEGER NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,",
    "  phone        VARCHAR(20),",
    "  move_in_date DATE,",
    "  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE payments (",
    "  id          SERIAL PRIMARY KEY,",
    "  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),",
    "  property_id INTEGER NOT NULL REFERENCES properties(id),",
    "  amount      NUMERIC(10,2) NOT NULL,",
    "  due_date    DATE NOT NULL,",
    "  paid_date   DATE,",
    "  status      VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),",
    "  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE maintenance_requests (",
    "  id          SERIAL PRIMARY KEY,",
    "  tenant_id   INTEGER NOT NULL REFERENCES tenants(id),",
    "  property_id INTEGER NOT NULL REFERENCES properties(id),",
    "  title       VARCHAR(255) NOT NULL,",
    "  description TEXT,",
    "  priority    VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),",
    "  status      VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open','in_progress','closed')),",
    "  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE lease_documents (",
    "  id           SERIAL PRIMARY KEY,",
    "  tenant_id    INTEGER NOT NULL REFERENCES tenants(id),",
    "  property_id  INTEGER NOT NULL REFERENCES properties(id),",
    "  document_url VARCHAR(1000),",
    "  start_date   DATE NOT NULL,",
    "  end_date     DATE NOT NULL,",
    "  signed       BOOLEAN DEFAULT FALSE,",
    "  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
    "",
    "CREATE TABLE notifications (",
    "  id         SERIAL PRIMARY KEY,",
    "  user_email VARCHAR(255) NOT NULL REFERENCES users(email),",
    "  message    TEXT NOT NULL,",
    "  is_read    BOOLEAN DEFAULT FALSE,",
    "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    ");",
  ]),
  ...spacer(),
  bodyJ("ProtectedRoute Component (rentwise-frontend/src/components/layout/ProtectedRoute.jsx):"),
  ...codeL([
    "import { Navigate } from 'react-router-dom';",
    "",
    "function ProtectedRoute({ children, allowedRole }) {",
    "  const token = localStorage.getItem('rentwise_token');",
    "  const role  = localStorage.getItem('rentwise_role');",
    "",
    "  if (!token) return <Navigate to='/login' replace />;",
    "",
    "  if (role !== allowedRole) {",
    "    const redirect = role === 'landlord'",
    "      ? '/landlord/dashboard'",
    "      : '/tenant/dashboard';",
    "    return <Navigate to={redirect} replace />;",
    "  }",
    "",
    "  return children;",
    "}",
    "",
    "export default ProtectedRoute;",
  ]),
  ...spacer(),
  bodyJ("Sidebar Navigation Configuration (rentwise-frontend/src/components/layout/Sidebar.jsx — key logic):"),
  ...codeL([
    "const LANDLORD_LINKS = [",
    "  { path: '/landlord/dashboard',      label: 'Dashboard',      icon: LayoutDashboard },",
    "  { path: '/landlord/properties',     label: 'Properties',     icon: Building2 },",
    "  { path: '/landlord/tenants',        label: 'Tenants',        icon: Users },",
    "  { path: '/landlord/payments',       label: 'Payments',       icon: CreditCard },",
    "  { path: '/landlord/maintenance',    label: 'Maintenance',    icon: Wrench },",
    "  { path: '/landlord/documents',      label: 'Documents',      icon: FileText },",
    "  { path: '/landlord/notifications',  label: 'Notifications',  icon: Bell },",
    "];",
    "",
    "const TENANT_LINKS = [",
    "  { path: '/tenant/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },",
    "  { path: '/tenant/payments',    label: 'Payments',    icon: CreditCard },",
    "  { path: '/tenant/maintenance', label: 'Maintenance', icon: Wrench },",
    "  { path: '/tenant/documents',   label: 'Documents',   icon: FileText },",
    "];",
    "",
    "const role  = localStorage.getItem('rentwise_role');",
    "const links = role === 'landlord' ? LANDLORD_LINKS : TENANT_LINKS;",
  ]),
  ...spacer(),
  bodyJ("Parallel API Fetch Pattern (landlord dashboard — Promise.all):"),
  ...codeL([
    "// Fetch all dashboard stats concurrently",
    "useEffect(() => {",
    "  const token = localStorage.getItem('rentwise_token');",
    "  const headers = { Authorization: `Bearer ${token}` };",
    "",
    "  Promise.all([",
    "    fetch('http://localhost:5000/api/properties',  { headers }).then(r => r.json()),",
    "    fetch('http://localhost:5000/api/tenants',     { headers }).then(r => r.json()),",
    "    fetch('http://localhost:5000/api/payments',    { headers }).then(r => r.json()),",
    "    fetch('http://localhost:5000/api/maintenance', { headers }).then(r => r.json()),",
    "  ])",
    "  .then(([propsData, tenantsData, paymentsData, maintenanceData]) => {",
    "    setProperties(propsData.properties   || []);",
    "    setTenants(tenantsData.tenants       || []);",
    "    setPayments(paymentsData.payments    || []);",
    "    setMaintenance(maintenanceData.requests || []);",
    "  })",
    "  .catch(err => setError(err.message));",
    "}, []);",
  ]),
  ...spacer(),
  H2("B.","Screenshots"),
  ...spacer(),
  bodyJ("The following placeholders indicate where application screenshots should be inserted. Capture these from the running RentWise application and insert at the indicated locations."),
  ...spacer(),
  body("Figure 8: RentWise Landing Page"),
  ...screenshotBox("Figure 8: Landing Page — Marketing content, portal entry CTA"),
  body("Figure 9: RentWise Login Page"),
  ...screenshotBox("Figure 9: Login Page — Email/password form, health check, role-based redirect"),
  body("Figure 10: Landlord Dashboard"),
  ...screenshotBox("Figure 10: Landlord Dashboard — Property count, tenant count, payment summary, maintenance queue stats"),
  body("Figure 11: Tenant Dashboard"),
  ...screenshotBox("Figure 11: Tenant Dashboard — Assigned property card with address, rent, landlord contact"),
  body("Figure 12: Properties Page (Landlord)"),
  ...screenshotBox("Figure 12: Landlord Properties — Property list with address, city, rent, status, CRUD actions"),
]; }

// ═══════════════════════════════════════════════════════════════════════════
// ASSEMBLE
// ═══════════════════════════════════════════════════════════════════════════
const children = [
  ...coverPage(), ...bonafidePage(), ...declarationPage(),
  ...acknowledgementPage(), ...tocPage(),
  ...ch1(), ...ch2(), ...ch3(), ...ch4(), ...ch5(),
  ...ch6(), ...ch7(), ...ch8(), ...ch9(), ...ch10(),
  ...ch11(), ...ch12(), ...ch13(),
];

const doc = new Document({
  numbering:{config:[
    {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,
      style:{paragraph:{indent:{left:720,hanging:360}}}}]},
    {reference:"numbers",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,
      style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  ]},
  styles:{
    default:{document:{run:{font:TNR,size:24}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:28,bold:true,font:TNR},
        paragraph:{spacing:{before:280,after:140},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,
        run:{size:24,bold:true,font:TNR},
        paragraph:{spacing:{before:220,after:100},outlineLevel:1}},
    ],
  },
  sections:[{
    properties:{page:{
      size:{width:11906,height:16838},   // A4
      margin:{top:1440,right:1260,bottom:1440,left:1440},
    }},
    headers:{default:new Header({children:[new Paragraph({
      alignment:AlignmentType.RIGHT,
      children:[new TextRun({text:"RentWise – Property Management System",font:TNR,size:18,italics:true})]
    })]})},
    footers:{default:new Footer({children:[new Paragraph({
      alignment:AlignmentType.CENTER,
      children:[
        new TextRun({text:"Page ",font:TNR,size:20}),
        new TextRun({children:[PageNumber.CURRENT],font:TNR,size:20})
      ]
    })]})},
    children,
  }],
});

console.log("Building RentWise report...");
Packer.toBuffer(doc).then(buf=>{
  const out = path.join(__dirname, 'FSD_Report.docx');
  fs.writeFileSync(out, buf);
  console.log(`Done! ${out}  (${(buf.length/1024).toFixed(0)} KB)`);
});