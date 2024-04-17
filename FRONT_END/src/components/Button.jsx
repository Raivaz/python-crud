import PropTypes from 'prop-types'

function Button({value, className, ...props}) {
    return (
        <div className="flex mt-2">
            <button 
                className={'text-white text-[14px] p-2 rounded-md w-full '+ className} {...props}
            >
                {value}
            </button>
        </div>
    )
}

Button.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
}


export default Button