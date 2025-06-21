import {SharedWithType} from "./SharedWith";
import {DocCommentType} from "./DocComment";
import {CategoryTemplateType, IEnumDocTempStatus} from "./categoryTemplateType";

export interface DocumentType {
  id?: number;
  domain: string;
  code: string;
  name: string;
  description: string;
  editionDate: string | Date;
  content: string;

  shared: boolean;
  isTemplateCopy: boolean;
  originalDocumentId?: number;

  tempType: IEnumDocTempStatus;

  // File info
  fileName?: string;
  originalFileName?: string;
  type?: string;
  path?: string;
  extension?: string;
  version?: string;

  // Audit
  createDate: string | Date;
  createdBy: string;
  updateDate: string | Date;
  updatedBy: string;

  // Relations
  sharedWithUsers: SharedWithType[];
  comments: DocCommentType[];
  template: CategoryTemplateType;
}




