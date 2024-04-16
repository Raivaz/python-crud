import axios from 'axios';
import { useState, useEffect } from 'react';
import Button from './components/Button';
import Label from './components/Label';
import { useForm } from 'react-hook-form'



function App() {

  const [data, setData] = useState('')
  const {register, handleSubmit, formState:{errors} } = useForm()


  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL)
      .then((res) => {
        console.log(res.data.response)
        setData(res.data.response)
      })
      .catch((e) => console.log(e))
  }, [])

  function onSubmit(data_form) {
    console.log(data_form)
  }

  return (
    <>
      <div className='grid grid-cols-6 gap-2 '>
        <header className='bg-slate-300 py-3 px-3 text-3xl text-gray-800 col-span-6 border-b-2 border-sky-500'>CRUD REACT COM PYTHON</header>
        <main className='col-span-5 bg-slate-400 h-[calc(100vh-80px)] ml-[10px] rounded-md'>
          <h2 className='p-3'>CADASTRADOS</h2>
          <table className='table-fixed'>
            <thead>
              <tr>
                <th className='w-[300px]'>Nome</th>
                <th className='w-[300px]'>E-mail</th>
                <th className='w-[300px]'>Senha</th>
              </tr>
            </thead>
            <tbody>
              {
                data && data.map((value, key) => (
                      
                      <tr className='text-center'>
                        <td>{value}</td>
                        <td>{value}</td>
                        <td>{value}</td>
                        <td>{value}</td>
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
                {...register('email',{required: true})}
              />
               {errors?.email?.type == 'required' && <p className='text-red-700'>campo obrigatório</p>}
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
            <Button onClick={(e) => {
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
