import React,{ useEffect, useState} from 'react'
import { LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha'
import CaptchaReloadIcon from '../assets/captcha-reload-icon.svg'

export default function Captcha({captchaValidation, refreshCaptcha, updateRefreshCaptcha, captchaValue, setCaptchaValue}) {

    let reloadCaptcha = ()=>{
        loadCaptchaEnginge(6,"grey","black")
        setCaptchaValue("")
        captchaValidation(false)
    }
    
    let handleCaptcha = (e)=>{
        let value = e.target.value;
        setCaptchaValue(value)
        captchaValidation(validateCaptcha(value,false))
    }

    useEffect(()=>{
        if(refreshCaptcha){
            reloadCaptcha();
            updateRefreshCaptcha()
        }
    },[refreshCaptcha])
    
    

    useEffect(()=>{
        loadCaptchaEnginge(6,"grey","black")
    },[])

  return (
    <div className='flex items-center space-x-3 mb-5 md:flex-col-reverse lg:flex-row max-[440px]:flex-col-reverse'>
        <input
            className='rounded-xl w-1/2 md:w-full max-[440px]:w-full lg:w-1/2 border-0 outline-0 bg-[#F5F5F5] py-4 px-10' 
            placeholder='Enter captcha' 
            value={captchaValue} 
            onChange={handleCaptcha}
        />
        <div className='flex w-1/2 justify-end space-x-4 items-center captcha-ele md:mb-7 lg:mb-0 max-[440px]:mb-7'>
            <LoadCanvasTemplateNoReload/>
            <img src={CaptchaReloadIcon} onClick={reloadCaptcha}/>
        </div>
        <div>
            
        </div>
    </div>
  )
}
