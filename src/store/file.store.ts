import {http} from "../utils/http";
import {AxiosResponse} from "axios";
import {CommonResponse} from "../utils/response";

class FilePathProps {
    path: string

    constructor(path: string) {
        this.path = path
    }
}

class FileItemOption {
    index: number;
    isDirectory: boolean;
    name: string;
    size: string;
    updateTime: string;

    constructor(index: number, isDir: boolean, name: string, size: string, updateTime: string) {
        this.name = name
        this.index = index
        this.size = size
        this.isDirectory = isDir
        this.updateTime = updateTime
    }

}

class ListFileResponse {
    list: FileItemOption[]

    constructor(files: FileItemOption[]) {
        this.list = files
    }
}

const FILE_LIST_URL = "/webssh/v1/listFiles"
const listFiles = async (props: FilePathProps): Promise<FileItemOption[]> => {
    let fileList: FileItemOption[] = []
    await http.post(FILE_LIST_URL, props).then((res: AxiosResponse<CommonResponse<ListFileResponse>>) => {
        fileList = res.data.result.list
        console.log("[FILELIST]: ", fileList)
    })

    return fileList
}

const FILE_DELETE_URL = "/webssh/v1/deleteFile"
const deleteFileRemote = async (props: FilePathProps): Promise<boolean> => {
    let status: boolean = false
    await http.post(FILE_DELETE_URL, props).then((res: AxiosResponse<CommonResponse<boolean>>) => {
        status = res.data.result
    }).catch(err => {
        status = false
        console.log(err)
    })

    return status
}

export class UploadProps {
    filePath: string;
    file: File;

    constructor(file: File, filePath: string) {
        this.file = file
        this.filePath = filePath
    }
}

const UPLOAD_API = "/webssh/v1/upload"
const uploadRemote = async (props: UploadProps): Promise<boolean> => {
    let uploadStatus = false
    const formData = new FormData()
    formData.append("file", props.file)
    formData.append("filePath", props.filePath)
    await http.post(UPLOAD_API, formData).then(res => {
        if (res.status !== 200) {
            uploadStatus = false;
        }
    }).catch(err => {
        uploadStatus = false
        console.log(err)
    })

    return uploadStatus
}

class GetRootPathResponse {
    rootPath: string

    constructor(path: string) {
        this.rootPath = path
    }
}
const GET_ROOT_PATH_URL = "/webssh/v1/getRootPath"
const getRootPath = async (): Promise<string> => {
    let rootPath = ""
    await http.post(GET_ROOT_PATH_URL).then((resp: AxiosResponse<CommonResponse<GetRootPathResponse>>) => {
        rootPath = resp.data.result.rootPath
    }).catch(err => {console.log(err)})

    return rootPath
}

class GetParentPathResponse {
    parentPath: string
    constructor(p: string) {
        this.parentPath = p
    }
}
const GET_PARENT_PATH_URL = "/webssh/v1/getParentPath"
const getParentPathRemote = async (pathNow: string): Promise<string> => {
    let parentPath = "/home"
    await http.post(GET_PARENT_PATH_URL, new FilePathProps(pathNow)).then((res: AxiosResponse<CommonResponse<GetParentPathResponse>>) => {
        parentPath = res.data.result.parentPath
    }).catch(err => {
        console.log(err)
    })

    return parentPath
}

export {listFiles, FileItemOption, FilePathProps, uploadRemote, deleteFileRemote, getRootPath, getParentPathRemote}
