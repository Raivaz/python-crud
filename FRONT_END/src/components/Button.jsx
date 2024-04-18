import PropTypes from 'prop-types'

function Button({value, className, ...props}) {
    
    return (
        
        <button 
            className={'text-white text-[14px] p-2 rounded-md '+ className} {...props}
        >
            {value}
        </button>
        
    )
}

Button.propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
}


export default Button