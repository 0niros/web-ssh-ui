import React, {createRef, useCallback, useEffect, useState} from "react";
import {FileItem} from "./FileItem";
import { Divider, Tag, Button, message, Drawer} from "antd";
import "./components.scss"
import {UploadOutlined} from "@ant-design/icons";
import {DownloadProps, downloadRemote} from "../store/download.store";
import {
    deleteFileRemote,
    FileItemOption,
    FilePathProps, getParentPathRemote, getRootPath,
    listFiles,
    UploadProps,
    uploadRemote
} from "../store/file.store";

const FileManager = () => {
    // 0 States.
    const [open, setOpen] = useState(false)
    const fileItemList: FileItemOption[] = []
    const [fileItems, setFileItem] = useState(fileItemList)
    const [rootPath, setRootPath] = useState("")

    // 1 Const and variables.
    const fileInput = createRef<HTMLInputElement>();
    const selectedFileMap: Map<number, FileItemOption> = new Map()

    const setRootPathNow = useCallback(async () => {
        let rootPathNow = rootPath
        if (rootPathNow.length === 0) {
            rootPathNow = await getRootPath()
            setRootPath(rootPathNow)
        }

        setFileItem(await listFiles(new FilePathProps(rootPathNow)))
    }, [rootPath])

    // 3 UseEffect method.
    useEffect(() => {
        setFileItem([])

        setRootPathNow().then()
    }, [rootPath, open, setRootPathNow]);


    const getSelectedFileItems = (): FileItemOption[] => {
        let selectedFiles : FileItemOption[] = []
        selectedFileMap.forEach((itemNow) => {
            if (itemNow === null || itemNow === undefined) {
                return
            }
            selectedFiles.push(itemNow)
        })

        return selectedFiles
    }

    const upload = () => {
        fileInput.current?.click()
    }

    const doUpload = async () => {
        let files = fileInput.current?.files
        if (files != null && files.length > 0) {
            for (let index = 0; index  < files.length; index++) {
                let fileNow = files.item(index)
                if (fileNow === null) {
                    continue
                }
                let filePath = rootPath.endsWith("/") ? rootPath + fileNow.name :rootPath + "/" + fileNow.name
                let uploadPram = new UploadProps(fileNow, filePath)
                await uploadRemote(uploadPram)
            }
        }
        refreshItems()
    }

    const buildFilePath = (fileName: string): string => {
        return  rootPath.endsWith("/") ? rootPath + fileName : rootPath + "/" + fileName
    }

    const download = () => {
        getSelectedFileItems().forEach(item => {
            let filePath = buildFilePath(item.name)
            doDownload(filePath)
        })
    }

    const doDownload = (filePath: string) => {
        downloadRemote(new DownloadProps(filePath))
    }

    const deleteFile = async () => {
        getSelectedFileItems().forEach(item => {
            let filePath = buildFilePath(item.name)
            doDelete(filePath)
        })
        refreshItems()
    }

    const doDelete = async (filePath: string) => {
        if (!deleteFileRemote(new FilePathProps(filePath)).then()) {
            message.error("Delete " + filePath + " error!")
        }
    }

    const onFileSelected = (a: number, b: FileItemOption, w: boolean) => {
        if (w) {
            selectedFileMap.set(a, b)
        } else {
            selectedFileMap.delete(a)
        }
    }

    const closeFileManager = () => {
        setOpen(false)
    }

    const openFileManager = () => {
        setOpen(true)
    }

    const backParentDir = async () => {
        setRootPath(await getParentPathRemote(rootPath))
    }

    const clickFileItem = (fileName: string, isDir: boolean) => {
        let childDir = buildFilePath(fileName)
        if (isDir) {
            setRootPath(childDir)
        } else {
            doDownload(childDir)
        }
    }

    const refreshItems = () => {
        setFileItem([])
        setRootPathNow().then()
    }

    return (
        <div>
            <Button type="primary" onClick={openFileManager}>File Manager</Button>
            <Drawer open={open} placement="right" width={500} onClose={closeFileManager}>
                <div className="file-manager">
                    <Button icon={<UploadOutlined />} onClick={upload}>Upload</Button>
                    <span> </span>
                    <Button onClick={download}>Download</Button>
                    <span> </span>
                    <Button danger onClick={deleteFile}>Delete</Button>
                    <Divider/>
                    <div className="path-block">
                        <Tag color="cyan" className="path-span">Path: {rootPath}</Tag>
                        <Button className="back-button" onClick={backParentDir}>Back</Button>
                    </div>
                    {fileItems.map(opt => {
                        let itemOpt = new FileItemOption(opt.index, opt.isDirectory,  opt.name, opt.size, opt.updateTime)
                        return (
                            <FileItem param={itemOpt} onSelected={onFileSelected} onClick={clickFileItem}/>
                        )
                    })}
                    <input ref={fileInput} type="file" style={{display: "none"}} onChange={doUpload}/>
                </div>
            </Drawer>
        </div>
    )
}

export {FileManager}