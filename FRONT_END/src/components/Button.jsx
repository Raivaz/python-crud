function Button({value = 'CADASTRAR', className, ...props}) {
    return (
        <div className="flex mt-2">
            <button 
                className={'bg-cyan-700 text-white text-[14px] p-2 rounded-md w-full hover:bg-cyan-600 ' + className} {...props}
            >
                {value}
            </button>
        </div>
    )
}

export default Button