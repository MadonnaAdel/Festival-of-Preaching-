import React, { useEffect, useState } from 'react';
import style from './login.module.css';
import {  json, Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { loginadmin } from '../../store/slices/adminSlice';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';

const Login = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tOkeen#1b3Jx&2024');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); 

  const validationSchema = Yup.object({
  adminName: Yup.string().required("لازم تدخل اسم المستخدم"),
  password: Yup.string().required("لازم تدخل كلمة السر")
});
const signIn = async (values) => {
  try {
    const res = await dispatch(loginadmin(values));

    if (res.meta.requestStatus == "fulfilled" && res.payload.data.token) {
      localStorage.setItem('tOkeen#1b3Jx&2024',res.payload.data.token)
      Navigate("/adminPage");
      toast.success("تم تسجيل الدخول");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غلط .");
    }
  } catch (error) {
    toast.error("حدث خطأ. حاول مرة أخرى.");
    console.error("Error during sign-in process:", error);
  }
};

const formik = useFormik({
  initialValues: { adminName: "", password: "" },
  validationSchema: validationSchema,
  onSubmit: signIn,
});
  const logOut = () => {
    localStorage.removeItem('tOkeen#1b3Jx&2024');
    setIsLoggedIn(false);
    Navigate("/login");
    toast.info('تمام سجلت خروج ')
}

  return (
    <>
      <ToastContainer/>
      <section className={`${style.signIn} text-end`}>
        <div className={`${style.signInForm} w-75 m-auto bg-white p-5`}>
            <h1 className="fw-bolder">منور الدنيا!</h1>

          {isLoggedIn ? (<>
            <p className="lead"> انت سجلت دخول قبل كدا عندك تلات اختيارات ياتسجل خروج ياتروح للصفحه الرئيسية ياتروح صفحة الادمن</p>
            <div className="d-flex justify-content-evenly align-items-center">
              <button className='btn btn-blue' onClick={logOut}>تسجيل خروج</button>
              <Link to='/'>
              <button className='btn btn-blue'>  الصفحة الرئيسية</button>
              </Link>
              <Link to='/adminPage'>
              <button className='btn btn-blue'>   صفحة الادمن </button>
              </Link>
            </div>
          </>) : (<>
              <p className="lead"> لو انت مش خادم ومش معاك كلمة السر واسم المستخدم ف انا بقولك متحاولش عشان السيستم دا مؤمن بكل اساليب الامان</p>
              <form onSubmit={formik.handleSubmit} className="mx-4 mt-2">
                <div>
                  <label htmlFor="adminName">اسم المستخدم</label>
                  <input
                    id="adminName"
                    type="text"
                    className="form-control my-3"
                    value={formik.values.adminName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.adminName && (
                    <div className=" text-danger">
                      {formik.errors.adminName}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="password">كلمة السر</label>
                  <input
                    id="password"
                    type="password"
                    className="form-control my-3"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.password && (
                    <div className=" text-danger">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                <button
                  className={`${style.btnsignIn} btn btn-blue `}
                  type="submit"
                >
                سجل دخول
                </button>
              </form>
          </>
         
          )}
             

        </div>
      </section>
    </>
  );
};

export default Login;
