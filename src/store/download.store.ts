import {http} from "../utils/http";

const DOWNLOAD_FILE_URL: string = "/webssh/v1/download"

export class DownloadProps {
    path: string;

    constructor(filePath: string) {
        this.path = filePath
    }
}

const downloadRemote = (props: DownloadProps) => {
    http.post(DOWNLOAD_FILE_URL, props).then(res => {
        const fileNameHeader = res?.headers['content-disposition'] || "file=file"
        const fileName: string = window.decodeURI(fileNameHeader?.split("=")[1])
        const url = window.URL.createObjectURL(
            new Blob([res.data], {
                type: "application/octet-stream",
            }),
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
    }).catch(err => {
        console.log(err)
    })
}

export {downloadRemote}