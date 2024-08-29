import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getallUsersWithoutPagenation } from '../../store/slices/allUsers';

export default function UserPage() {
  const [username, setUsername] = useState('');
  const [birthDate, setbirthDate] = useState('');
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.allUsers.allUsers.users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(getallUsersWithoutPagenation());
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') {
      setUsername(value);
    } else if (id === 'birthDate') {
      setbirthDate(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!username) newErrors.username = 'يرجى إدخال اسمك.';
    if (!birthDate) newErrors.birthDate = 'يرجى إدخال تاريخ ميلادك.';
    if (!validateFullName(username)) newErrors.username = 'الاسم يجب أن يكون ثلاثي.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
       const filteredUsers = allUsers.filter(user =>
      user.name.toLowerCase().includes(username.toLowerCase()) && user.birthDate === birthDate
    );


      setResults(filteredUsers);
      if (filteredUsers.length === 0) {
        setNoResults(true);      
      } else {
        setNoResults(false);       
      }
    }
  };

  const validateFullName = (name) => {
    const nameParts = name.trim().split(' ');
    return nameParts.length >= 3  ;
  };

  return (
    <div className='w-50 m-auto'>
      <h4>دخل اسمك ثلاثي وتاريخ ميلادك عشان يطلعلك الكود</h4>
      <form className="mt-2 text-end" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">اسمك</label>
          <input
            id="username"
            type="text"
            className="form-control my-3"
            placeholder='دخل اسمك كامل'
            value={username}
            onChange={handleChange}
          />
          {errors.username && (
            <div className="text-danger">
              {errors.username}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="birthDate">تاريخ ميلادك</label>
          <input
            id="birthDate"
            type="date"
            className="form-control my-3"
            value={birthDate}
            onChange={handleChange}
          />
          {errors.birthDate && (
            <div className="text-danger">
              {errors.birthDate}
            </div>
          )}
        </div>

        <button
          className={`btn btn-blue`}
          type="submit"
        >
          ارسال
        </button>
      </form>

      {loading ? (
        <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
      ) : results.length > 0 ? (


      <>
                 <table className="table table-info-subtle table-striped-columns overflow-x-auto mt-4" >
                        <thead>
                            <tr>
                          
                                <th>الاسم</th>
                                <th>الكود</th>
                                <th>تاريخ الميلاد</th>
                            </tr>
                        </thead>
                        <tbody>

                           
                                 {results.map((result, index) => (
                                    <tr key={result._id}>
                                        <td>{result.name}</td>
                                        <td>{result.code}</td>
                                        <td>{result.birthDate}</td>
                                    </tr>
                              
                            ))}
                        </tbody>
                    </table>
      </>
      ) : noResults && (
        <div className="mt-4  mx-auto">
              <img src="no-result.svg" alt="" width='400px'  />
              <h5>لم يتم العثور على نتائج تطابق البحث.</h5>
        </div>
      )}
    </div>
  );
}
