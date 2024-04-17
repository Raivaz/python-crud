import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { FaRegTrashCan, FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import Button from './components/Button';
import Label from './components/Label';
import ReactLoading from 'react-loading'



function App() {
  const api_url = import.meta.env.VITE_API_URL
  const [buttonName, setButtonName] = useState('CADASTRAR')
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const {register, handleSubmit, reset, setValue, formState:{errors} } = useForm()
 
  
  useEffect(() => {
    axios.get(api_url)
      .then((res) => {
        setRegistrations(res.data.response)
      })
      .catch((e) => console.log(e))
  },[])


  //cadastro
  function onSubmit(form_data) {
    console.log(form_data)
    axios.post(api_url, form_data)
    .then((response) => {
      console.log(response)
      response.status == 200 && setRegistrations([...registrations, Object.values(form_data)])
      reset()
    })
    .catch((error) => {
      error.response.status == 405 && alert('Email já cadastrado')
    })
  }


  //exclusão
  function delete_register(email, position) {
    setLoading(true)
    axios.post(`${api_url}/delete/${email}`)
    .then(() => {
      setRegistrations(
        registrations.filter((user_register, key) => {
          if (key != position) {
            return user_register
          }
        })
      )
      setLoading(false)
    }).catch((error) => console.log(error))
  }

  //edição
  function edit_register(register) {
    console.log(register)
    
    setValue('name', register[1])
    setValue('email', register[2])
    setValue('password', register[3])
    setButtonName('EDITAR')
  }

  return (
    <>
      <div className='grid grid-cols-6 gap-2 '>
        <header className='bg-slate-300 py-3 px-3 text-3xl text-gray-800 col-span-6 border-b-2 border-sky-500'>CRUD REACT COM PYTHON</header>
        <main className='col-span-5 bg-slate-400 h-[calc(100vh-80px)] ml-[10px] rounded-md'>
          <div className='relative p-2'>
            <h2 className='p-3'>CADASTRADOS</h2>
            {loading && <ReactLoading type='spokes' color='#fcff00' width='40px' className='m-4 absolute right-0 top-0'/>}
            
          </div>
          <table className='w-full'>
            <thead>
              <tr>
                <th className='w-[25%]'>Nome</th>
                <th className='w-[25%]'>E-mail</th>
                <th className='w-[25%]'>Senha</th>
                <th className='w-[25%]'>Ações</th>
              </tr>
            </thead>
            <tbody>
              {
                registrations && registrations.map((register, key) => (   
                  <tr className='text-center' key={key}>
                    { 
                      register.map((value) => (
                        typeof value != 'number' &&
                        <td key={value}>{value}</td>   
                      ))
                    }
                    <td className='flex gap-4 justify-center'>
                      <FaRegTrashCan 
                        className='hover:fill-red-custom' 
                        size={23} color='#b11623' 
                        cursor={'pointer'}
                        onClick={() => delete_register(register[2], key)}
                      />
                      <FaPenToSquare 
                        className='hover:fill-cyan-300' 
                        size={23} color='#09738a' 
                        cursor={'pointer'}
                        onClick={() => edit_register(register)}
                      />
                    </td>    
                  </tr>                   
                ))
              }
            </tbody>
          </table>
        </main>
        <div className='bg-slate-400 mr-[8px] rounded-md flex justify-center'>
          <form className='mt-5 w-[95%]'>
            <div className='mt-2'>
              <Label text='Nome'/>
              <input 
                className="w-full p-2 bg-slate-500 text-white rounded-md outline-none focus:ring-2 focus:ring-sky-700 focus:ring-inset"
                type='text' 
                name='name'
                {...register('name',{required: true})}
                
              />
              {errors?.name?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
            </div>
            <div className='mt-2'>
              <Label text='E-mail'/>
              <input 
                className="w-full p-2 bg-slate-500 text-white rounded-md outline-none focus:ring-2 focus:ring-sky-700 focus:ring-inset"
                type='text' 
                name='email'
                
                {...register('email',{required: true, validate: (value) => {
                  return value.includes('@')  == true && value.includes('.') == true
                    
                }})}
              />
               {errors?.email?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
               {errors?.email?.type == 'validate' && <p className='text-red-700'>digite um email válido</p>}
            </div>
            <div className='mt-2'>
              <Label text='Senha'/>
              <input 
                className="w-full p-2 bg-slate-500 text-white rounded-md outline-none focus:ring-2 focus:ring-sky-700 focus:ring-inset"
                type='text' 
                name='password'
                
                {...register('password',{required: true, minLength: 8})}
              />
               {errors?.password?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
               {errors?.password?.type == 'minLength' && <p className='text-red-700'>senha deve conter no mínimo 8 caracteres</p>}
            </div>
            <Button
              className={buttonName == 'CADASTRAR' ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-yellow-500 hover:bg-yellow-400'}
              value={buttonName}
              onClick={(e) => {
              e.preventDefault()
              handleSubmit(onSubmit)()
            }}/>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
