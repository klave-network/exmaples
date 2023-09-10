import classNames from "classnames";
import { getSelfId, ChatMessage } from "../utils/apiFunctions";

export const Message: React.FC<ChatMessage> = ({ message, sender, timestamp }) => {
    return (
        <div className={classNames(
            "flex flex-col gap",
            getSelfId() === sender ? 'ml-auto' : 'mr-auto')}>
            <span className="font-mono text-xs">
                {timestamp}
            </span>
            <span className={classNames(
                "rounded-xl w-fit p-2",
                getSelfId() === sender ? 'bg-slate-600' : 'bg-blue-500')}>
                {message}
            </span>
        </div>
    )
}