import {Terminal} from 'xterm'
import {FitAddon} from  'xterm-addon-fit'
import 'xterm/css/xterm.css'
import './components.scss'
import React, {useEffect} from "react";
import {message} from "antd";
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

    term.onData(data => {
        console.log(term.cols, term.rows)
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
            <div ref={terminalRef} className="terminal"></div>
            <FileManager />
        </>
    )
}

export {SshTerminal}