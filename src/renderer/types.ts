export interface DisciplineDTO {
    id: number;
    title: string;
    modified_at: Date;
    jekyll_folder: string;
    deploy_command: string;
    site_url: string;
    archive: boolean;
    groups: Array<number>;
}

export interface LabDTO {
    id: number;
    alias: string;
    title: string;
    order: number;
    icon: string;
    group_id: number;
    type: number;
    content: string;
    content_additional: string;
    remark: string;
    modified_at: Date;
    discipline_id: number;
    visible: boolean;
}

export interface Subtask {
    content: string;
}

export interface StudentInfo {
    id: number;
    date_done: Date;
}


export interface TaskDTO {
    id: number;
    title: string;
    complexity: number;
    content: string;
    additional_content: string;
    order: number;
    tags: string;
    visible: boolean;
    group_id: number;
    lab_id: number;
    custom_class: string;
    youtube_link: string;
    subtasks: Array<Subtask>
    students_info: Array<StudentInfo>
    show_help_in_modal: boolean;
}

export interface TaskGroupDTO {
    id: number;
    title: string;
    lab_id: number;
    type: number;
    order: number;
}

export interface SelectOption {
    value: any
    text: string
}