function TabButton({ text, active = false, onClick }) {
    return (
        <button
            className={`pb-4 text-sm font-medium ${active
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default TabButton;