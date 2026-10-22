export type ServiceRequest={kind:'repair'|'paint'|'rental';title:string;itemId:string}
export type ServiceRequestFields={name:string;phone:string;model:string;description:string;car:string;paintCode?:string;comment:string;start:string;end:string;quantity:string}
export type ServiceRequestDraft={submissionId:string;request:ServiceRequest;fields:ServiceRequestFields;photoAttached:boolean}
