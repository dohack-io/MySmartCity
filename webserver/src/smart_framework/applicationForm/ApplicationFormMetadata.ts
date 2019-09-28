export interface ApplicationFormMetadata {
    applicationFormTitle: string;
    applicationFormDescription: string;
}

export interface ApplicationFormRestMetadata extends ApplicationFormMetadata {
    fullName: string;
}