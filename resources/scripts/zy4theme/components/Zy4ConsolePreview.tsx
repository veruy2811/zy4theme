import React, { FormEvent, useState } from 'react';
import { zy4ConsoleLogs } from '../data/zy4DemoData';
import { Zy4Icon } from './Zy4Icons';

interface Zy4ConsolePreviewProps {
    logs?: string[];
    consoleHref?: string;
    onOpenConsole?: () => void;
    onCommandSubmit?: (command: string) => void;
}

const parseConsoleLine = (line: string) => {
    const match = line.match(/^(\[[^\]]+\])\s+(\[[^\]]+\])\s+(.*)$/);

    if (!match) {
        return { timestamp: '', level: '', message: line, levelClass: 'info' };
    }

    const level = match[2].replace(/\[|\]/g, '').toLowerCase();

    return {
        timestamp: match[1],
        level: match[2],
        message: match[3],
        levelClass: level.includes('warn') ? 'warning' : level.includes('error') ? 'error' : 'info',
    };
};

export const Zy4ConsolePreview = ({
    logs = zy4ConsoleLogs,
    consoleHref,
    onOpenConsole,
    onCommandSubmit,
}: Zy4ConsolePreviewProps) => {
    const [command, setCommand] = useState('');

    const submitCommand = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedCommand = command.trim();
        if (!trimmedCommand) {
            return;
        }

        onCommandSubmit?.(trimmedCommand);
        setCommand('');
    };

    const openButton = (
        <span className="zy4-panel-action-label">
            Open Console
            <Zy4Icon name="external" size={16} />
        </span>
    );

    return (
        <section className="zy4-card zy4-console-panel" aria-labelledby="zy4-console-title">
            <div className="zy4-panel-header">
                <div>
                    <Zy4Icon name="terminal" size={22} aria-hidden />
                    <h2 id="zy4-console-title">Live Console</h2>
                </div>
                {consoleHref ? (
                    <a className="zy4-panel-action" href={consoleHref}>
                        {openButton}
                    </a>
                ) : onOpenConsole ? (
                    <button className="zy4-panel-action" type="button" onClick={onOpenConsole}>
                        {openButton}
                    </button>
                ) : null}
            </div>

            <div className="zy4-terminal" role="log" aria-live="polite">
                {logs.map((line, index) => {
                    const parsed = parseConsoleLine(line);

                    return (
                        <p key={`${line}-${index}`}>
                            {parsed.timestamp && <span className="zy4-terminal-time">{parsed.timestamp}</span>}
                            {parsed.level && (
                                <span className={`zy4-terminal-level zy4-terminal-level-${parsed.levelClass}`}>
                                    {parsed.level}
                                </span>
                            )}
                            <span className="zy4-terminal-message">{parsed.message}</span>
                        </p>
                    );
                })}
            </div>

            <form className="zy4-command-bar" onSubmit={submitCommand}>
                <Zy4Icon name="console" size={18} aria-hidden />
                <input
                    aria-label="Console command"
                    onChange={(event) => setCommand(event.target.value)}
                    placeholder="Type a command..."
                    readOnly={!onCommandSubmit}
                    value={command}
                />
            </form>
        </section>
    );
};
