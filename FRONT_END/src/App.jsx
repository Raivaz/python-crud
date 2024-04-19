import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { FaRegTrashCan, FaPenToSquare } from "react-icons/fa6";
import axios from 'axios';
import Button from './components/Button';
import Label from './components/Label';
import ReactLoading from 'react-loading'



function App() {
  const api_url = import.meta.env.VITE_API_URL
  const [ButtonCancel, setButtonCancel] = useState(false)
  const [typeCadastro, setTypeCadastro] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [infoRegister, setInfoRegister] = useState({'id_db': 0, 'position_array':0})
  const [loading, setLoading] = useState(false)
  const {register, handleSubmit, reset, setValue, formState:{errors} } = useForm()
 

 

  useEffect(() => {
    setLoading(true)
    axios.get(api_url)
      .then((res) => {
        setRegistrations(res.data.response)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
      })
  },[])


  //cadastro
  function onSubmit(form_data) {
    console.log(form_data)
    setLoading(true)
    axios.post(api_url, form_data)
    .then((response) => {
      response.status == 200 && registrations.push(response.data.response[0])
      reset()
      setLoading(false)
    })
    .catch((error) => {
      error.response.status == 405 && alert('Email já cadastrado')
      setLoading(false)
    })
  }


  //exclusão
  function delete_register(id, position) {
    setLoading(true)
    axios.post(`${api_url}/delete/${id}`)
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

  //editar
  function edit_register(data) {
    setLoading(true)
    axios.post(`${api_url}/id/${infoRegister.id_db}`, data)
    .then(() => {
      let register_edited = Object.values(data)
      register_edited.unshift(infoRegister.id_db)
      registrations[infoRegister.position_array]=register_edited
      setLoading(false)
      reset()
      setButtonCancel(false)
    })
    .catch((error) => console.log(error))
  }

  function onImport(file) {
    setLoading(true)
    let formData = new FormData()
    formData.append('data', file.file[0])
    
    const config = {
      header: {
        'Content-Type': 'multipart/form-data'
      }
    }

    axios.post(`${api_url}/import`, formData, config)
    .then((res) => {
      console.log(res)
      setLoading(false)
      reset()
      window.location.reload()
    
    })
    .catch((erro) => {
      setLoading(false)
      console.log(erro)
    })
  }

  //formulário de edição
  function edit_form(register, key) {
    setButtonCancel(true)
    setInfoRegister({id_db: register[0], position_array: key})
    setValue('name', register[1])
    setValue('email', register[2])
    setValue('password', register[3])
  
  }


  return (
    <>
      <div className='grid grid-cols-6 gap-2 '>
        <header className='py-3 px-3 text-3xl text-gray-800 col-span-6 border-b-2 border-gray-200'>CRUD REACT COM PYTHON</header>
        <main className='col-span-5 h-[calc(100vh-80px)] ml-[10px] rounded-md overflow-auto border-2 border-gray-200'>
          <div className='relative p-2'>
            <h2 className='p-3 font-semibold text-1xl'>CADASTRADOS</h2>
            {loading && <ReactLoading type='spokes' color='#ff8006' width='40px' className='m-4 absolute right-0 top-0'/>}
            
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
                  <tr className='text-center cursor-pointer' key={key}>
                    { 
                      register.map((value) => (
                        typeof value != 'number' &&
                        <td className='py-2' key={value}>{value}</td>   
                      ))
                    }
                    <td className='flex gap-4 justify-center py-2'>
                      <FaRegTrashCan 
                        className='hover:fill-red-custom' 
                        size={23} color='#b11623' 
                        cursor={'pointer'}
                        onClick={() => delete_register(register[0], key)}
                      />
                      <FaPenToSquare 
                        className='hover:fill-cyan-300' 
                        size={23} color='#09738a' 
                        cursor={'pointer'}
                        onClick={() => edit_form(register, key)}
                      />
                    </td>    
                  </tr>                   
                ))
              }
            </tbody>
          </table>
        </main>
        <div className='mr-[8px] rounded-md p-3 border-2 border-gray-200'>
          <div className='flex'>
            <button 
              className={(typeCadastro ? 'bg-gray-400 text-gray-100' : 'text-gray-500 ') + ' w-[100%] p-1 rounded-tl-md rounded-bl-md font-semibold'}
              onClick={() => setTypeCadastro(true)}
            >
              CADASTRO
            </button>
            <button 
              className={(!typeCadastro ? 'bg-gray-400 text-gray-100' : 'text-gray-500') + ' bg-slate-450 w-[100%] p-1 rounded-tr-md rounded-br-md  font-semibold'}
              onClick={() => setTypeCadastro(false)}
            >
              IMPORT
            </button>
          
          </div>
         { typeCadastro ? 
         <form className='mt-5'>
           <div className='mt-2'>
              <Label text='Nome'/>
              <input 
                className="w-full p-2 bg-slate-200 text-black rounded-md outline-none focus:ring-2 focus:ring-gray-300 focus:ring-inset"
                type='text' 
                name='name'
                {...register('name',{required: true})}
                
              />
              {errors?.name?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
            </div>
            <div className='mt-2'>
              <Label text='E-mail'/>
              <input 
                className="w-full p-2 bg-slate-200 text-black rounded-md outline-none focus:ring-2 focus:ring-gray-300 focus:ring-inset"
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
                className="w-full p-2 bg-slate-200 text-black rounded-md outline-none focus:ring-2 focus:ring-gray-300 focus:ring-inset"
                type='password' 
                name='password'
                
                {...register('password',{required: true, minLength: 8})}
              />
               {errors?.password?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
               {errors?.password?.type == 'minLength' && <p className='text-red-700'>senha deve conter no mínimo 8 caracteres</p>}
             
            </div>
            <div className='flex mt-2 justify-between'>
              
              {ButtonCancel ?
                <>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      handleSubmit(edit_register)()
                    }}
                    value='EDITAR'
                    className='bg-yellow-500 hover:bg-yellow-400 w-[48%]'
                  />

                  <Button
                    onClick={() => reset()}
                    value='CANCELAR'
                    className='bg-red-700 hover:bg-red-600 w-[48%]'
                  />
                </>
                :
                <Button
                  className='w-full bg-cyan-700 hover:bg-cyan-600'
                  value='CADASTRAR'
                  onClick={(e) => {
                  e.preventDefault()
                  handleSubmit(onSubmit)()
                }}/>
                
              }
            </div>
          </form> 
          :
          <form  encType='multipart/form-data'>
            <input 
              type='file' 
              name='file'
              className='
                py-3
                w-full text-sm 
                text-gray-500
                file:py-2
                mt-2
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-slate-200 file:text-gray-500
                hover:file:bg-violet-100'
              {...register('file',{required: true})}
             
            />
            {errors?.file?.type == 'required' && <p className='text-red-700'>Nenhum arquivo foi selecionado</p>}
            <Button
              className='w-full bg-orange-500 mt-3 hover:bg-orange-600'
              value='IMPORTAR'         
              onClick={(e) => {
              e.preventDefault()
              handleSubmit(onImport)()
              
            }}/>
               
          </form>
          
          }
        </div>
      </div>
    </>
  )
}

export default App
