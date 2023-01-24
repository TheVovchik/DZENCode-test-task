import {
  createContext, FC, useEffect, useState,
} from 'react';
import axios from 'axios';
import { generateCaptcha } from '../../api/captcha';
import { Captcha } from '../../types/Captcha';

type Props = {
  children: React.ReactNode;
  quoted: string,
};

type Context = {
  captcha: Captcha | null,
  captchaValue: string,
  userName: string,
  email: string,
  homepage: string,
  message: string,
  loadingError: boolean,
  file: File | null,
  refreshCaptcha: () => void,
  changeCaptchaValue: (value: string) => void,
  changeUserName: (value: string) => void,
  changeEmail: (value: string) => void,
  changeHomepage: (value: string) => void,
  changeMessage: (value: string) => void,
  uploadFile: (files: FileList | null) => void,
};

export const FormContext = createContext<Context>({
  captcha: null,
  captchaValue: '',
  userName: '',
  email: '',
  homepage: '',
  message: '',
  loadingError: false,
  file: null,
  refreshCaptcha: () => {},
  changeCaptchaValue: () => {},
  changeUserName: () => {},
  changeEmail: () => {},
  changeHomepage: () => {},
  changeMessage: () => {},
  uploadFile: () => {},
});

export const FormProvider: FC<Props> = ({ children, quoted }) => {
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaValue, setCaptchaValue] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [homepage, setHomepage] = useState('');
  const [message, setMessage] = useState(quoted);
  const [loadingError, setLoadingError] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const loadCaptcha = async () => {
    try {
      const newCaptcha = await generateCaptcha();

      setLoadingError(false);
      setCaptcha(newCaptcha);
    } catch (error) {
      setLoadingError(true);

      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('different error than axios');
      }
    }
  };

  const changeCaptchaValue = (value: string) => {
    setCaptchaValue(value);
  };

  const changeUserName = (value: string) => {
    setUserName(value);
  };

  const changeEmail = (value: string) => {
    setEmail(value);
  };

  const changeHomepage = (value: string) => {
    setHomepage(value);
  };

  const changeMessage = (value: string) => {
    setMessage(value);
  };

  const uploadFile = (
    files: FileList | null,
  ) => {
    if (files) {
      setFile(files[0]);
    }
  };

  const refreshCaptcha = () => {
    loadCaptcha();
    setCaptchaValue('');
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const contextValue = {
    captcha,
    captchaValue,
    userName,
    email,
    homepage,
    message,
    loadingError,
    file,
    refreshCaptcha,
    changeCaptchaValue,
    changeUserName,
    changeEmail,
    changeHomepage,
    changeMessage,
    uploadFile,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
