import React, { useEffect, useRef, useState } from 'react';
import style from './adminpage.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, deleteUser, getAllUsers, updateUser } from '../../store/slices/userSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Fuse from 'fuse.js';
import { getallUsersWithoutPagenation } from '../../store/slices/allUsers';
export default function AdminPage() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [updateId, setUpdateId] = useState('');


    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);


    const allUsers = useSelector((state) => state.allUsers.allUsers.users);
    
    const res = useSelector((state) => state.users.users);
    const users = res.users || [];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                await dispatch(getAllUsers({ page: 1, limit: 50 }));
                await dispatch(getallUsersWithoutPagenation());
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [dispatch]);

const handleDelete = async (id) => {
    setLoading(true);
    try {
        const res = await dispatch(deleteUser(id));
console.log(res);

        if (res.payload && res.payload.message.includes('successfully')) {
            toast.success("تمام البيانات اتضافت");
            await dispatch(getAllUsers({ page: res.currentPage, limit: 50 }));
            await dispatch(getallUsersWithoutPagenation());
        } else {
            toast.error('في حاجة غلط حصلت');
        }
    } catch (err) {
        console.log('Error during deletion:', err);
        toast.error('حدث خطأ أثناء عملية الحذف');
    } finally {
        setLoading(false);
    }
};


    const validationSchema = Yup.object({
        name: Yup.string()
            .required("لازم تدخل الاسم")
            .test('is-three-part-name', 'دخل الاسم ثلاثي', value => {
                if (!value) return false;
                const parts = value.trim().split(' ');
                return parts.length >= 3;
            }),
        code: Yup.string().required("لازم تدخل الكود"),
        birthDate: Yup.string().required("لازم تدخل تاريخ الميلاد"),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            churchName: "كنيسة السيدة العذراء مريم بمنفلوط",
            code: "",
            birthDate: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {

                const res = await dispatch(addUser(values));

                if (res.payload.message.includes('successfully')) {
                    await dispatch(getAllUsers({ page: res.currentPage, limit: 50 }));
                      await dispatch(getallUsersWithoutPagenation());
                    toast.success("تمام البيانات اتضافت");
                } else if (res.payload.message.includes('duplicate key')) {
                    toast.error("لا مضفش في حاجة غلط ممكن يكون الاسم او الكود مكررين");
                }
            } catch (err) {
                console.log(err);
            }
        },
    });

const editFormik = useFormik({
    initialValues: {
        name: "",
        churchName: "كنيسة السيدة العذراء مريم بمنفلوط",
        code: "",
        birthDate: "",
    },
    validationSchema,
    onSubmit: async (values) => {
        try {
            const id = updateId;
            const user = JSON.stringify(values);
            const res = await dispatch(updateUser({id, user}));

            if (res?.payload?.message?.includes('successfully')) {
                toast.success("تم تحديث البيانات بنجاح");
            } else if (res?.payload?.message?.includes('duplicate key')) {
                toast.error("هناك خطأ: ربما يكون الاسم أو الكود مكررين");
            }

            await dispatch(getAllUsers({ page: res.currentPage || 1, limit: 50 }));
            await dispatch(getallUsersWithoutPagenation());
        } catch (error) {
            console.error("Error during form submission:", error);
            toast.error("حدث خطأ أثناء تحديث البيانات");
        }
    },
});


    const displayNumber = (index) => (res.currentPage - 1) * 50 + index + 1;

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
    const fuse = new Fuse(allUsers, {
        keys: ['name'],
        threshold: 0.3,
    });

    const handleSearch = (e) => {
        const input = e.target.value;
        setQuery(input);
        const searchResults = fuse.search(input);
        setResults(searchResults.map(result => result.item));
    };

    return (
        <>
            <ToastContainer />
            <div className="mt-5">
                <h2 className="text-center mb-4">جدول البيانات</h2>
                <div className={`${style.searchAdd} d-flex justify-content-between align-items-center mb-3`}>
                    <div className={`${style.search}`}>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="ابحث بالاسم"
                        />
                        <button type="submit">بحث</button>
                    </div>
                    <div className="add">
                        <button type="button" className="btn btn-blue" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            اضافة
                            <i className="fa-solid fa-user-plus m-2"></i>
                        </button>
                    </div>
                </div>
                {users.length > 0 ? (
      <div className="table-responsive">
  <table className="table table-info-subtle table-striped-columns">
    <thead>
      <tr>
        <th>#</th>
        <th>الاسم</th>
        <th>الكنيسة</th>
        <th>الكود</th>
        <th>تاريخ الميلاد</th>
        <th>#</th>
      </tr>
    </thead>
    <tbody>
      {results.length > 0 ? (
        results.map((result, index) => (
          <tr key={result._id}>
            <td>{displayNumber(index)}</td>
            <td>{result.name}</td>
            <td>{result.churchName}</td>
            <td>{result.code}</td>
            <td>{result.birthDate}</td>
            <td>
              <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => handleDelete(result._id)}>
                      مسح<i className="fa-regular fa-trash-can text-danger m-2"></i>
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => setUpdateId(result._id)}>
                      تعديل<i className="fa-regular fa-pen-to-square m-2"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))
      ) : (
        users.map((user, index) => (
          <tr key={user._id}>
            <td>{displayNumber(index)}</td>
            <td>{user.name}</td>
            <td>{user.churchName}</td>
            <td>{user.code}</td>
            <td>{user.birthDate}</td>
            <td>
              <div className="dropdown">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => handleDelete(user._id)}>
                      مسح<i className="fa-regular fa-trash-can text-danger m-2"></i>
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => setUpdateId(user._id)}>
                      تعديل<i className="fa-regular fa-pen-to-square m-2"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

                ) : (
                    <div className="text-center">
                        <img src="./not-found.svg" alt="not found" width='60%' />
                    </div>
                )}
                <div className="d-flex justify-content-between mt-4 align-items-center">
                    <button className="btn btn-blue" onClick={() => dispatch(getAllUsers({ page: res.currentPage - 1, limit: 50 }))} disabled={res.currentPage === 1}>
                        السابق
                    </button>
                    <button className="btn btn-blue" onClick={() => dispatch(getAllUsers({ page: res.currentPage + 1, limit: 50 }))} disabled={res.currentPage === res.totalPages}>
                        التالي
                    </button>
                </div>

            </div>

            <div className="modal fade" dir='rtl' id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">اضافة بيانات</h5>
                        </div>
                        <div className="modal-body">
                            <p>خلي بالك وانت بتضيف البيانات، أي خطأ أو اسم أو كود متكرر، البيانات مش هتضاف.</p>
                            <form onSubmit={formik.handleSubmit} className="text-end">
                                <div className="form-group input-component">
                                    <label htmlFor="name">الاسم</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                        placeholder="دخل الاسم ثلاثي"
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.name && formik.touched.name && (
                                        <p className="text-danger p-0 m-0">{formik.errors.name}</p>
                                    )}
                                </div>
                                <div className="form-group input-component">
                                    <label htmlFor="churchName">اسم الكنيسة التابع ليها</label>
                                    <select
                                        name="churchName"
                                        id="churchName"
                                        className="form-select mt-2"
                                        onChange={formik.handleChange}
                                        value={formik.values.churchName}
                                        onBlur={formik.handleBlur}
                                    >
                                        <option value="كنيسة السيدة العذراء بمنفلوط" selected>كنيسة السيدة العذراء بمنفلوط</option>
                                    </select>
                                    {formik.errors.churchName && formik.touched.churchName && (
                                        <p className="text-danger p-0 m-0">{formik.errors.churchName}</p>
                                    )}
                                </div>
                                <div className="form-group input-component">
                                    <label htmlFor="code">الكود</label>
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        value={formik.values.code}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.code && formik.touched.code && (
                                        <p className="text-danger p-0 m-0">{formik.errors.code}</p>
                                    )}
                                </div>
                                <div className="form-group input-component">
                                    <label htmlFor="birthDate">تاريخ الميلاد</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        className="form-control mt-2"
                                        onChange={formik.handleChange}
                                        value={formik.values.birthDate}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.birthDate && formik.touched.birthDate && (
                                        <p className="text-danger p-0 m-0">{formik.errors.birthDate}</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">اغلاق</button>
                                    <button type="submit" className="btn btn-blue">اضافة</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" dir="rtl" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">تعديل بيانات</h5>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={editFormik.handleSubmit} className="text-end">
                                <div className="form-group input-component">
                                    <label htmlFor="name">الاسم</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control mt-2"
                                        onChange={editFormik.handleChange}
                                        value={editFormik.values.name}
                                        placeholder="دخل الاسم ثلاثي"
                                        onBlur={editFormik.handleBlur}
                                    />
                                    {editFormik.errors.name && editFormik.touched.name && (
                                        <p className="text-danger p-0 m-0">{editFormik.errors.name}</p>
                                    )}
                                </div>
                                <div className="form-group input-component">
                                    <label htmlFor="code">الكود</label>
                                    <input
                                        type="text"
                                        name="code"
                                        id="code"
                                        className="form-control mt-2"
                                        onChange={editFormik.handleChange}
                                        value={editFormik.values.code}
                                        onBlur={editFormik.handleBlur}
                                    />
                                    {editFormik.errors.code && editFormik.touched.code && (
                                        <p className="text-danger p-0 m-0">{editFormik.errors.code}</p>
                                    )}
                                </div>
                                <div className="form-group input-component">
                                    <label htmlFor="birthDate">تاريخ الميلاد</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        className="form-control mt-2"
                                        onChange={editFormik.handleChange}
                                        value={editFormik.values.birthDate}
                                        onBlur={editFormik.handleBlur}
                                    />
                                    {editFormik.errors.birthDate && editFormik.touched.birthDate && (
                                        <p className="text-danger p-0 m-0">{editFormik.errors.birthDate}</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">اغلاق</button>
                                    <button type="submit" className="btn btn-blue" >حفظ التعديلات</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
