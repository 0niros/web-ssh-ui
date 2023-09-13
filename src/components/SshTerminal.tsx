import {Terminal} from 'xterm'
import {FitAddon} from  'xterm-addon-fit'
import 'xterm/css/xterm.css'
import './components.scss'
import React, {useEffect} from "react";
import {Col, message, Row, Tag} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {SshConfig} from "./SshConfiguration";
import {FileManager} from "./FileManager";
const SshTerminal = () => {
    const term: Terminal = new Terminal({
        // windowsMode: true,
        cursorStyle: 'bar',
        convertEol: true,
        disableStdin: false,
        cursorBlink: true,
        scrollback: 15000,
        fontFamily: "CascadiaCode",
        fontSize: 14,
        theme: {
            foreground: "#ECECEC",
            background: "#282c34",
            cursor: "help",
        }
    })
    const fitAddon = new FitAddon()
    const navi = useNavigate()

    const terminalRef = React.useRef<HTMLDivElement|null>(null);
    const config: SshConfig = useLocation().state
    if (config.address === "" || config.wsPath === "" || config.port === "" || config.hostname === "" || config.password === "") {
        navi("/index/configuration")
        message.error("Invalid ssh config params.").then()
    }
    const ws = new WebSocket(config.wsPath)
    message.loading("Connecting to " + config.wsPath).then()

    ws.onopen = () => {
        ws.send(JSON.stringify({
            "hostname": config.hostname,
            "password": config.password,
            "address": config.address,
            "port": config.port,
            "cols": term.cols,
            "rows": term.rows
        }))
        message.success("Ws Connected.").then()
        term.writeln("Waiting for connect to " + config.wsPath)
    }

    ws.onmessage = (msg) => {
        term.write(msg.data)
    }

    ws.onclose = () => {
        term.writeln("Connection closed.")
    }

    term.onKey(e => {
        let data: string = e.key
        switch (e.domEvent.key) {
            case "Enter": data = "\n"; break
            case "Tab": data = "\t"; break
            case "Backspace": data = "\b"; break
        }
    
        ws.send(data)
    })

    useEffect(() => {
        if (terminalRef === null || terminalRef.current === null || terminalRef.current === undefined) {
            message.error("Open terminal failed.").then()
            return
        }
        term.loadAddon(fitAddon)
        term.open(terminalRef.current)
        term.focus()
        term.writeln("Terminal started.")
        fitAddon.fit()
    })

    return (
        <>
            <div className="terminal-content">
                <div ref={terminalRef} className="terminal"></div>
            </div>
            <Row className="terminal-footer">
                    <Col span={6}><FileManager /></Col>
                    <Col span={6}><Tag className="footer-span" color="#2db7f5">Host: {config.address} </Tag></Col>
                    <Col span={6}><Tag className="footer-span" color="#2db7f5">Port: {config.port} </Tag></Col>
                    <Col span={6}><Tag className="footer-span" color="#2db7f5">User: {config.hostname} </Tag></Col>
            </Row>
        </>
    )
}

export {SshTerminal}
