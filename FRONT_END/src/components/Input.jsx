

function Input({type = 'text', ...props}) {
    return (
        <>
            <input 
               
                className="w-full p-2 bg-slate-500 text-white rounded-md outline-none focus:ring-2 focus:ring-sky-700 focus:ring-inset"
                {...props}
                type={type} 

            />
        </>
    )
}

export default Input
