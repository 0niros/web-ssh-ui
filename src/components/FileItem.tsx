import {FolderOpenOutlined, FileTextOutlined} from "@ant-design/icons";
import "./components.scss"
import {Col, Radio, Row} from "antd";
import {useEffect, useState} from "react";
import {FileItemOption} from "../store/file.store";

export class FileItemParams {
    param: FileItemOption
    onSelected: (b: number, c: FileItemOption, w: boolean) => void
    onClick: (a: string, b: boolean) => void

    constructor(param: FileItemOption, onSelected: (b: number, c: FileItemOption, w: boolean) => void, click: (a: string, b: boolean) => void) {
        this.param = param
        this.onSelected = onSelected
        this.onClick = click
    }
}

const FileItem = (props: FileItemParams) => {
    const [selected, setSelected] = useState(false);

    const changeSelectStatus = () => {
        props.onSelected(props.param.index, props.param, !selected)
        setSelected(!selected)
    }

    const clickFileName = () => {
        props.onClick(props.param.name, props.param.isDirectory)
    }

    useEffect(() => {
        setSelected(false)
    }, []);

    return (
        <div className="file-item">
            <Row>
                <Col span={4}>
                    <Radio className="ratio" checked={selected} onClick={changeSelectStatus}></Radio>
                    {props.param.isDirectory ? <FolderOpenOutlined className="file-icon"/> : <FileTextOutlined className="file-icon" />}
                </Col>
                <Col span={12} onClick={clickFileName}>
                    {props.param.isDirectory ? <span className="dir-name">{props.param.name}</span> : <span className="file-name">{props.param.name}</span>}
                </Col>
                <Col span={8}>
                    <span className="file-size">{props.param.size}<br/>{props.param.updateTime}</span>
                </Col>
            </Row>
        </div>
    )
}

export {FileItem}