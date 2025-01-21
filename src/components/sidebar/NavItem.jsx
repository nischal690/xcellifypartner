

export default function NavItem({ icon, text, active, className, onClick : _onClick }) {
    return (
        <a
            href="javascript:;"
            onClick={_onClick}
            className={`flex items-center space-x-2 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 ${active ? 'bg-purple-50 text-purple-600' : ''
                } ${className}`}
        >
            <span className="text-xl">{icon}</span>
            <span>{text}</span>
        </a>
    );
}