"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';  // useRouter import
import { AuthService } from '@/shared';

const SignUpPage = () => {
  const { register, handleSubmit, watch, formState: { errors }, getValues, setValue, setError, clearErrors} = useForm<User.IAuthForm>({mode: 'onBlur'});
  const router = useRouter(); // useRouter 초기화

  const { signup, checkEmailDuplicate, checkNicknameDuplicate } = AuthService();
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);
  const [isNicknameDuplicate, setIsNicknameDuplicate] = useState(false);  

    // 비밀번호 숨김 / 보임 기능

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const togglePasswordConfirmVisibility = () => {
      setShowPasswordConfirm(!showPasswordConfirm);
    };

  
  
  // 입학 년도, 혹은 졸업 년도 리스트 저장
  const startYear = 1972; 
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearOptions.push(year);
  }


  // 수행한 학기 배열로 저장 1-1, 1-2, 2-1 ... 4-2 순서대로
  const currentCompletedSemester = [];
  for (let j = 1; j <= 4; j++) {
    for (let k = 1; k <= 2; k++) {
      currentCompletedSemester.push(`${j}학년 ${k}학기`);
    }
  } 


  
  // 파일 업로드할 때 파일 이미지들 배열로 저장
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const files = watch("files") as FileList;
  useEffect(() => {
    if (files && files.length > 0) {
      const newImagePreviews = Array.from(files).map(file =>
        URL.createObjectURL(file)
      );
      setImagePreviews(prevPreviews => [...newImagePreviews.reverse(), ...prevPreviews]);
      console.log(imagePreviews);
    }
  }, [files]);

  // 이미지 클릭 시 확대 기능

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // 이미지 삭제 기능

  const handleImageDelete = (index: number) => {
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };
  // 이용약관 선택 여부
  const handleCheckboxChange = (checked: boolean) => {
    setValue('agreeToTerms', checked);
    setValue('agreeToPopup', checked);
  };


  // 이용 약관 모달 창
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedStatus, setSelectedStatus] = useState(''); // 학적상태 선택에 따른 UI 표시
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // 회원가입 성공, 혹은 실패 시 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [countdown, setCountdown] = useState(0);

  const closeCompleteModal = () => {
    if (isSuccessModalOpen) {
      router.push('/auth/signin');
    } else {
      setIsSuccessModalOpen(false);
      setIsErrorModalOpen(false);
    }
  };

  // 제출
  const onSubmit = async (data: User.IAuthForm) => {
    
  
    try {
      const response = await signup(data);  // signup 함수 호출
  
      if (response) {  // 성공한 경우
        setIsSuccessModalOpen(true);
        setCountdown(5);
  
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsSuccessModalOpen(false);
              router.push('/auth/signin');  // 성공 시 리다이렉션
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error: any) {
      // 에러 발생 시 처리
      console.error('SignUp error:', error);
      setIsErrorModalOpen(true);
      setServerError(error.message || '회원가입 중 문제가 발생했습니다.');  // 에러 메시지 처리
    }
  };
  


  // 필수 항목을 입력하지 않고, 또는 잘못 입력한 상태로 제출했을 경우
  const [isIncompleteModalOpen, setIsIncompleteModalOpen] = useState(false);
  const closeInCompleteModal = () => {
    setIsIncompleteModalOpen(false);
  }
  const onInvalid = (errors: any) => {
    // 모든 필드를 입력하지 않았을 경우에 대한 로직
    console.error('Form Errors:', errors);
    setIsIncompleteModalOpen(true);  // 모든 필드를 입력하지 않았을 때 모달을 띄움
  };

  const handleError = (errorData: { errorCode: number; message: string, field?: string }) => {
    const { errorCode, message, field } = errorData;
    setServerError(errorData.message);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white-100 w-full">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="">
        
        <h1 className="sm:text-3xl text-2xl font-bold mb-6 text-center mt-8">회원가입</h1>
        
        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">아이디</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="text" 
            placeholder="아이디를 입력해주세요" 
            {...register('email', { 
              required: '아이디를 입력해주세요',              
              
              pattern: {
                value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: '이메일 형식으로 입력해주세요'
              }})}

              onBlur={async (e) => {
                const email = e.target.value;
                if (email) {
                  const isDuplicate = await checkEmailDuplicate(email);
                  console.log(isDuplicate);
                  setIsEmailDuplicate(isDuplicate);
                }
              }}

          />
        {errors.email && <p>{errors.email.message}</p>}
        {isEmailDuplicate && <p>이미 사용 중인 이메일입니다.</p>}
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">비밀번호</label>
          <div className="w-full flex">
            <input 
              className="p-2 mr-4 border-2 border-gray-300 rounded-lg w-full max-w-md" 
              type={showPassword ? "text" : "password"}
              placeholder="8자리 이상, 영어/숫자/특수 문자 조합" 
              {...register('password', {
                required: '비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message: '8글자 이상 입력해주세요',
                },
                pattern: {
                  value:
                  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message:
                  '비밀번호를 8~16자로 영문, 숫자, 특수기호를 조합해서 사용하세요. ',
                }
              })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className=""
            >            {showPassword ? (
              <FaEye></FaEye>
            ) : (
              <FaEyeSlash></FaEyeSlash> 
            )}
          </button>
          
        </div>
          <p>{errors?.password?.message}</p>

        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">비밀번호 확인</label>
          <div className = "w-full flex">
            <input 
              className="p-2 mr-4 border-2 border-gray-300 rounded-lg w-full max-w-md" 
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="8자리 이상, 영어/숫자/특수 문자 조합" 
              {...register('pwConfirm', { 
                required: '비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message: '8글자 이상 입력해주세요',
                },
                pattern: {
                  value:
                  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
                  message:
                  '비밀번호를 8~16자로 영문, 숫자, 특수기호를 조합해서 사용하세요. ',
                },
                validate: {
                  check: (val) => {
                  if (getValues("password") !== val) {
                      return "비밀번호가 일치하지 않습니다.";
                  }
                }
              }
              })}/>
              <button
                type="button"
                onClick={togglePasswordConfirmVisibility}
                className=""
              >            {showPasswordConfirm ? (
                <FaEye></FaEye>
              ) : (
                <FaEyeSlash></FaEyeSlash>
              )}
            </button>
          </div>

          <p>{errors?.pwConfirm?.message}</p>

        </div>
        
        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">이름</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="text" 
            placeholder="이름을 입력해주세요" 
            {...register('name', {
              required: '이름을 입력해주세요' })}
          />
          <p>{errors?.name?.message}</p>
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">닉네임</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="text" 
            placeholder="닉네임을 입력해주세요" 
            {...register('nickname', { 
              required: '닉네임을 입력해주세요',

              minLength: {
                value: 1,
                message: "닉네임은 1글자 이상 16글자 이내로 입력해주세요"
              },
              maxLength: {
                value: 16,
                message: "닉네임은 1글자 이상 16글자 이내로 입력해주세요"
              }
            })}
            onBlur={async (e) => {
              const nickname = e.target.value;
              if (nickname) {
                const isDuplicate = await checkNicknameDuplicate(nickname);
                console.log(isDuplicate);
                setIsNicknameDuplicate(isDuplicate);
              }
            }}

        />
      {errors.nickname && <p>{errors.nickname.message}</p>}
      {isNicknameDuplicate && <p>이미 사용 중인 닉네임입니다.</p>}
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">입학년도</label>
          <select 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md"
            {...register('admissionYear', { 
              required: '입학 년도를 선택해주세요' })}
          >
            <option value="">-선택해주세요-</option>
            {yearOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p>{errors?.admissionYear?.message}</p>
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">학번</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="number" 
            placeholder="학번 8자리를 입력해주세요" 
            {...register('studentId', { 
              required:
              '학번을 입력해주세요',
              pattern:
              {
                value : /^\d{8}$/,
                message : '학번은 8자리로 입력해주세요'
              } 
            }
              
            )}
          />
          <p>{errors?.studentId?.message}</p>
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">학부/학과</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="text" 
            placeholder="ex) 소프트웨어학부, 컴퓨터공학부" 
            {...register('major', {
              required: '학부/학과를 입력해주세요'})}
          />
          <p>{errors?.major?.message}</p>
        </div>

        <div className="mb-6 ml-4 mr-4">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">연락처</label>
          <input 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md" 
            type="text" 
            placeholder="-를 넣어 작성해주세요. ex) 010-1234-1234" 
            {...register('phoneNumberHyphen', { 
              required: '연락처를 입력해주세요',
              pattern: {
                value: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/,
                message: '전화번호 형식이 아닙니다.'
              } })}
          />
          <p>{errors?.phoneNumberHyphen?.message}</p>
        </div>

        <div className="mb-6 ml-4 mr-4">
          <div className = "flex sm:flex-col">
            <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2 sm:mb-0">학적 상태</label>
            <p className="text-md text-red-500 mt-1 ml-4 sm:ml-0">(졸업 선택 시 추후 재학/휴학 전환이 불가합니다)</p>
          </div>
          <select
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md"
            {...register('academicStatus', { 
              required: '학적 상태를 선택해주세요' })}
              onChange={handleStatusChange}
          >
            <option value="">-선택해주세요-</option>
            <option key="ENROLLED" value= "ENROLLED">재학</option>
            <option key="LEAVE_OF_ABSENCE" value = "LEAVE_OF_ABSENSE">휴학</option>
            <option key="GRADUATED" value="GRADUATED">졸업</option>
          </select>
          <p>{errors?.academicStatus?.message}</p>
        </div>
        
        {(selectedStatus === 'ENROLLED'|| selectedStatus === 'LEAVE_OF_ABSENCE') &&(
        <div className="mb-6 ml-4 mr-4">
          <div className = "flex sm:flex-col">
            <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2 sm:mb-0">현재 등록 완료된 학기</label>
            <p className="text-md text-red-500 mt-1 ml-4 sm:ml-0">(등록금을 납부한 학기)</p>
          </div>
          <select 
            className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md"
            {...register('currentCompletedSemester', { 
              required: '현재 등록 완료된 학기를 선택해주세요' })}
          >
            <option value="">-선택해주세요-</option>
            {currentCompletedSemester.map((option, index) => (
              <option key={index + 1} value={index + 1}>
                {`${index + 1}차 학기 (${option})`}
              </option>
            ))}
            <option key="9" value= '9'>9차 학기 이상</option>
          </select>
          <p>{errors?.currentCompletedSemester?.message}</p>
        </div>)}
        

        {selectedStatus === 'GRADUATED' &&(
        <div>
          <div className="mb-6 ml-4 mr-4 max-w-md">
            <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">졸업 시기</label>

            <div className="flex space-x-4 sm:space-x-0 sm:flex-col">

              <div>
                <div className="flex space-x-4">
                  <p className = "text-gray-700 sm:text-xl text-lg font-bold mb-2 p-2">년</p>
                  <select 
                    className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md"
                    {...register('graduationYear', { 
                      required: '졸업 년도를 선택해주세요' })}
                  >
                    <option value="">-선택해주세요-</option>
                    {yearOptions.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <p>{errors?.graduationYear?.message}</p>

              </div>

              <div>
                <div className="flex space-x-4">
                  <p className = "text-gray-700 sm:text-xl text-lg font-bold mb-2 p-2">월</p>
                  <select 
                    className="p-2 border-2 border-gray-300 rounded-lg w-full max-w-md"
                    {...register('graduationMonth', { 
                      required: '졸업한 월을 선택해주세요' })}
                  >
                    <option value="">-선택해주세요-</option>
                    <option key="1" value="2">2월</option>
                    <option key="2" value="8">8월</option>
                  </select>
                </div>
                <p>{errors?.graduationMonth?.message}</p>
              </div>
            </div>
          </div>

        </div>)}



        <div className="mb-2 ml-4 mr-4 max-w-md">
          <label className="block text-gray-700 sm:text-xl text-lg font-bold mb-2">학부 재적/졸업 증빙 자료</label>
          <p className="text-md text-red-500 mt-1">
          ex) mportal &gt; 내 정보수정 &gt; 등록현황, 재학/휴학 증명서, 졸업 증명서, 졸업장 등
            증빙 자료 포함 필수 요소: 이름, 학번, 학부(학과), 현재 학적 상태(재학/휴학/졸업), 재학/휴학의 경우 수료 학기 차수, 졸업의 경우 졸업 시기
          </p>
          
          <div className="flex items-center justify-left border-2 border-gray-300 rounded-lg p-4 overflow-auto">
            <div className="w-32 h-32 border-2 border-gray-300 rounded-lg p-4 mr-4 flex-shrink-0 basis-1/3">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="text-gray-600 mt-2 text-center sm:hidden">파일을 선택하세요</span>
                <input id="file-upload" type="file" multiple className="hidden" {...register('files', { 
                  required: '파일을 첨부해 주세요' })} />
              </label>            
            </div>
            {imagePreviews.length > 0 && (
              <div className="flex flex-nowrap basis-1/3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-full cursor-pointer"
                      onClick={() => handleImageClick(preview)}
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 mt-1 mr-1 bg-red-500 text-white rounded-full p-1"
                      onClick={() => handleImageDelete(index)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className = "ml-4 mb-4">
        {errors.files && (
          <p className="text-gray-700 sm:text-xl text-lg font-bold mt-2">{errors.files.message}</p>
        )}
        </div>

        <div className="flex items-center ml-4">
          <input type="checkbox" className="mr-2" {...register('agreeToTerms', { 
            required: '(약관에 동의해주세요)',
            onChange: (e) => handleCheckboxChange(e.target.checked)
          })}/>
          <label htmlFor="terms">
            <label className="text-gray-700 sm:text-xl text-lg underline cursor-pointer" onClick={openModal}>
              약관 읽고 동의하기!!!
            </label>
          </label>
        </div>
        <div className = "ml-4 mb-4">
        {errors.agreeToTerms && (
          <p className="text-gray-700 sm:text-xl text-lg font-bold mt-2">{errors.agreeToTerms.message}</p>
        )}
        </div>

        <div className="flex justify-center mb-8">
          <button
            type="submit"
            className="w-full max-w-xs bg-focus text-black p-2 rounded-lg hover:bg-blue-400 transition-colors duration-300"
          >
            생성하기
          </button>
        </div>
      </form>

      {/* 사진을 클릭했을 때 표시되는 모달 */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImage}>
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-full overflow-auto">
            <img src={selectedImage} alt="Selected" className="object-contain w-full h-full" />
          </div>
        </div>
      )}

      {/* 모든 필드를 입력하지 않았을 때 표시되는 모달 */}
            {isIncompleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeInCompleteModal}>
          <div className="bg-white ml-4 mr-4 p-6 rounded-lg max-w-xs w-full grid justify-items-center">
            <h2 className="text-xl font-bold mb-4">입력되지 않은 항목이 있습니다</h2>
            <p className="mb-4">모든 항목을 조건에 맞게 입력해주세요.</p>
          </div>
        </div>
      )}

      {/* 회원가입을 성공했을 때 표시되는 모달 */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg w-xs h-xs justify-center items-center h-1/3 overflow-y-auto">
            <div className = "grid justify-items-center">
            <h2 className="text-xl font-bold mb-4">회원가입 완료</h2>
            <p>회원가입이 성공적으로 완료되었습니다!</p>
            <button
              onClick={closeCompleteModal}
              className="w-2/3 p-4 text-sm bg-focus mt-6 hover:bg-blue-500 text-white p-2 rounded-lg"
            >
              로그인 창으로 바로 이동
            </button>
            <p className="mt-4 text-gray-500"> ({countdown}초 후에 로그인 창으로 이동합니다.)</p>

            </div>
          </div>
        </div>
      )}

      {/* 회원가입 도중 에러 발생했을 때 표시되는 모달 */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto" onClick = {closeCompleteModal}>
          <div className="bg-white ml-4 mr-4 p-6 rounded-lg max-w-xs w-full">
            <div className = "grid justify-items-center">
            <h2 className="text-xl font-bold mb-4">회원가입 실패</h2>
            <p>{serverError}</p>

            </div>
          </div>
        </div>
      )}

      {/* 이용약관 모달 */}
{isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full h-5/6 overflow-y-auto">
            <div>
            <>
          <div title="이용 약관" />
          <div className="">
            <div className="">
              <h2 className='font-bold flex justify-center mb-6 text-lg'>서비스 이용약관</h2>
              <h1 />
              제1조(목적)
              <br />
              이 약관은 중앙대학교 소프트웨어학부 특별기구 ICT위원회 (이하 '위원회' 라고 합니다)가
              제공하는 제반 서비스의 이용과 관련하여 위원회와 회원과의 권리, 의무 및 책임사항, 기타
              필요한 사항을 규정함을 목적으로 합니다.
              <br />
              <br />
              제2조(정의)
              <br />
              이 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.
              <br />
              1. '서비스'라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와
              상관없이 '이용자'가 이용할 수 있는 위원회가 제공하는 제반 서비스를 의미합니다.
              <br />
              2. '이용자'란 이 약관에 따라 위원회가 제공하는 서비스를 받는 '개인회원' , '기업회원' 및
              '비회원'을 말합니다.
              <br />
              3. '개인회원'은 위원회에 개인정보를 제공하여 회원등록을 한 사람으로, 위원회로부터
              지속적으로 정보를 제공받고 '위원회'가 제공하는 서비스를 계속적으로 이용할 수 있는 자를
              말합니다.
              <br />
              4. '기업회원'은 위원회에 기업정보 및 개인정보를 제공하여 회원등록을 한 사람으로,
              위원회로부터 지속적으로 정보를 제공받고 위원회가 제공하는 서비스를 계속적으로 이용할 수
              있는 자를 말합니다.
              <br />
              5. '비회원'은 회원가입 없이 위원회가 제공하는 서비스를 이용하는 자를 말합니다.
              <br />
              6. '아이디(ID)'라 함은 회원의 식별과 서비스이용을 위하여 위원회이 정하고 위원회가 승인하는
              문자 또는 문자와 숫자의 조합을 의미합니다.
              <br />
              7. '비밀번호'라 함은 위원회이 부여받은 아이디와 일치되는 위원회임을 확인하고 비밀의 보호를
              위해 위원회 자신이 정한 문자(특수문자 포함)와 숫자의 조합을 의미합니다.
              <br />
              8. '콘텐츠'란 정보통신망법의 규정에 따라 정보통신망에서 사용되는 부호
              ·문자·음성·음향·이미지 또는 영상 등으로 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크
              등을 말합니다.
              <br />
              <br />
              제3조(약관 외 준칙)
              <br />
              이 약관에서 정하지 아니한 사항에 대해서는 법령 또는 위원회가 정한 서비스의 개별약관,
              운영정책 및 규칙 등(이하 세부지침)의 규정에 따릅니다. 또한 본 약관과 세부지침이 충돌할
              경우에는 세부지침에 따릅니다.
              <br />
              <br />
              제4조(약관의 효력과 변경)
              <br />
              1. 이 약관은 중앙대학교 소프트웨어학부 특별기구 ICT위원회(이)가 제공하는 모든
              인터넷서비스에 게시하여 공시합니다. 위원회는 '전자상거래등에서의 소비자보호에 관한
              법률(이하 '전자상거래법'이라 함)', '약관의 규제에 관한 법률(이하' 약관규제법'이라 함)',
              '정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법'이라 함)' 등 본
              서비스와 관련된 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며, 위원회는 약관이
              변경되는 경우에 변경된 약관의 내용과 시행일을 정하여, 그 시행일로부터 최소 7일 (이용자에게
              불리하거나 중대한 사항의 변경은 30일) 이전부터 시행일 후 상당한 기간 동안 공지하고, 기존
              이용자에게는 변경된 약관, 적용일자 및 변경사유(변경될 내용 중 중요사항에 대한 설명을
              포함)를 별도의 전자적 수단(전자우편, 문자메시지, 서비스 내 전자쪽지발송, 알림 메시지를
              띄우는 등의 방법)으로 개별 통지합니다. 변경된 약관은 공지하거나 통지한 시행일로부터 효력이
              발생합니다.
              <br />
              2. 위원회가 제1항에 따라 개정약관을 공지 또는 통지하는 경우 '변경에 동의하지 아니한 경우
              공지일 또는 통지를 받은 날로부터 7일(이용자에게 불리하거나 중대한 사항의 변경인 경우에는
              30일) 내에 계약을 해지할 수 있으며, 계약해지의 의사표시를 하지 아니한 경우에는 변경에
              동의한 것으로 본다.' 라는 취지의 내용을 함께 통지합니다.
              <br />
              3. 이용자가 제2항의 공지일 또는 통지를 받은 날로부터 7일(또는 이용자에게 불리하거나 중대한
              사항의 변경인 경우에는 30일)내에 변경된 약관에 대해 거절의 의사를 표시하지 않았을 때에는
              본 약관의 변경에 동의한 것으로 간주합니다.
              <br />
              <br />
              제5조(이용자에 대한 통지)
              <br />
              1. 위원회는 이 약관에 별도 규정이 없는 한 이용자에게 전자우편, 문자메시지(SMS), 전자쪽지,
              푸쉬(Push)알림 등의 전자적 수단을 이용하여 통지할 수 있습니다.
              <br />
              2. 위원회는 이용자 전체에 대한 통지의 경우 7일 이상 위원회가 운영하는 웹사이트 내의
              게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다. 다만, 이용자 본인의 거래와
              관련하여 중대한 영향을 미치는 사항에 대하여는 제1항의 개별 통지를 합니다.
              <br />
              3. 위원회는 이용자의 연락처 미기재, 변경 후 미수정, 오기재 등으로 인하여 개별 통지가
              어려운 경우에 한하여 전항의 공지를 함으로써 개별 통지를 한 것으로 간주합니다.
              <br />
              <br />
              제6조(이용계약의 체결)
              <br />
              이용계약은 다음의 경우에 체결됩니다.
              <br />
              1. 이용자가 회원으로 가입하고자 하는 경우 이용자가 약관의 내용에 대하여 동의를 한 다음
              회원가입신청을 하고 위원회가 이러한 신청에 대하여 승낙한 때
              <br />
              2. 이용자가 회원 가입 없이 이용할 수 있는 서비스에 대하여 회원 가입의 신청없이 서비스를
              이용하고자 하는 경우에는 위원회 서비스 이용을 위해 결제하는 때
              <br />
              3. 이용자가 회원가입 없이 이용할 수 있는 서비스에 대하여 회원가입의 신청없이 무료 서비스를
              이용하고자 하는 경우에는 그 무료 서비스와 관련된 사항의 저장 등 부가서비스를 이용하면서 위
              1호 및 2호의 절차를 진행한 때
              <br />
              <br />
              제7조(회원가입에 대한 승낙)
              <br />
              1. 위원회는 이용계약에 대한 요청이 있을 때, 위원회가 정한 회원 가입 대상에 부합하는 경우
              서비스 이용을 승낙함을 원칙으로 합니다.
              <br />
              2. 전항에도 불구하고, 다음 각호의 사유에 해당하는 경우 위원회는 회원가입을 보류하거나
              거절하는 등 제한할 수 있습니다.
              <br />
              1. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우(단, 위원회의
              재가입 승낙을 얻은 경우에는 예외로 함)
              <br />
              2. 실명이 아니거나 타인의 명의를 도용한 경우
              <br />
              3. 위원회가 정하는 필수정보를 누락하거나 허위로 기재한 경우
              <br />
              4. 만 14세 미만의 아동, 만 19세 미만의 미성년자, 피한정후견인, 피성년후견인이 법정대리인의
              동의를 얻지 않은 경우
              <br />
              5. 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 이 약관 등 위원회가 규정한
              운영원칙을 위반한 경우
              <br />
              6. 신용정보의 이용과 보호에 관한 법률에 따라 PC통신, 인터넷서비스의 신용불량자로 등록되어
              있는 경우
              <br />
              7. 정보통신윤리위원회에 PC통신, 인터넷서비스의 불량이용자로 등록되어 있는 경우
              <br />
              8. 이미 사용 중인 회원정보 또는 공서양속을 저해하는 아이디를 사용하고자 하는 경우
              <br />
              3. 제1항에 따른 신청에 있어 위원회는 서비스 제공에 필요한 경우 전문기관을 통한 실명확인 및
              본인인증을 요청할 수 있습니다.
              <br />
              4. 위원회는 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는
              승낙을 유보할 수 있습니다.
              <br />
              5. 제2항과 제4항에 따라 서비스 이용을 승낙하지 아니하거나 유보한 경우, 위원회는 원칙적으로
              이를 서비스 이용 신청자에게 알리도록 합니다. 단, 위원회의 귀책사유 없이 이용자에게 알릴 수
              없는 경우에는 예외로 합니다.
              <br />
              6. 이용계약의 성립 시기는 제6조 제1호의 경우에는 위원회가 가입완료를 신청절차 상에서
              표시한 시점, 제6조 제2호의 경우에는 결제가 완료되었다는 표시가 된 시점으로 합니다.
              <br />
              7. 위원회는 회원에 대해 위원회정책에 따라 등급별로 구분하여 이용시간, 이용횟수, 서비스
              메뉴 등을 세분하여 이용에 차등을 둘 수 있습니다.
              <br />
              8. 위원회는 회원에 대하여 '영화및비디오물의진흥에관한법률' 및 '청소년보호법' 등에 따른
              등급 및 연령 준수를 위하여 이용제한이나 등급별 제한을 둘 수 있습니다.
              <br />
              <br />
              제8조(회원정보의 변경)
              <br />
              1. 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수
              있습니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.
              <br />
              2. 회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편
              기타 방법으로 위원회에 대하여 그 변경사항을 알려야 합니다.
              <br />
              3. 제2항의 변경사항을 위원회에 알리지 않아 발생한 불이익에 대하여는 회원에게 책임이
              있습니다.
              <br />
              <br />
              제9조(회원정보의 관리 및 보호)
              <br />
              1. 회원의 아이디(ID)와 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가 이용하도록
              하여서는 안 됩니다.
              <br />
              2. 위원회는 회원의 아이디(ID)가 개인정보 유출 우려가 있거나, 반사회적 또는 공서양속에
              어긋나거나, 위원회 또는 서비스의 운영자로 오인할 우려가 있는 경우, 해당 아이디(ID)의
              이용을 제한할 수 있습니다.
              <br />
              3. 회원은 아이디(ID) 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를
              즉시 위원회에 통지하고 안내에 따라야 합니다.
              <br />
              4. 제3항의 경우 해당 회원이 위원회에 그 사실을 통지하지 않거나, 통지하였으나 위원회의
              안내에 따르지 않아 발생한 불이익에 대하여 위원회는 책임지지 않습니다.
              <br />
              <br />
              제10조(위원회의 의무)
              <br />
              1. 위원회는 계속적이고 안정적인 서비스의 제공을 위하여 설비에 장애가 생기거나 멸실된
              때에는 이를 지체 없이 수리 또는 복구하며, 다음 각 호의 사유 발생 시 부득이한 경우 예고
              없이 서비스의 전부 또는 일부의 제공을 일시 중지할 수 있습니다. 이 경우 그 사유 및 중지
              기간 등을 이용자에게 지체 없이 사후 공지합니다.
              <br />
              1. 시스템의 긴급점검, 증설, 교체, 시설의 보수 또는 공사를 하기 위하여 필요한 경우
              <br />
              2. 새로운 서비스를 제공하기 위하여 시스템교체가 필요하다고 판단되는 경우
              <br />
              3. 시스템 또는 기타 서비스 설비의 장애, 유무선 Network 장애 등으로 정상적인 서비스 제공이
              불가능할 경우
              <br />
              4. 국가비상사태, 정전, 불가항력적 사유로 인한 경우
              <br />
              2. 위원회는 이용계약의 체결, 계약사항의 변경 및 해지 등 이용자와의 계약관련 절차 및 내용
              등에 있어 이용자에게 편의를 제공하도록 노력합니다.
              <br />
              3. 위원회는 대표자의 성명, 주소, 전화번호, 이용약관, 개인정보취급방침 등을 이용자가 쉽게
              알 수 있도록 온라인 서비스에 게시합니다.
              <br />
              <br />
              제11조(개인정보보호)
              <br />
              1. 위원회는 이용자들의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호 등에 관한
              법률, 개인정보보호법 등 관련 법규를 준수하기 위해 노력합니다. 위원회는 개인정보보호정책을
              통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를
              위해 어떠한 조치가 취해지고 있는지 알려드립니다.
              <br />
              2. 위원회는 최종 사용일로부터 연속하여 5년 동안 서비스 사용 이력이 없는 경우
              '개인정보보호법' 및 같은 법 시행령의 규정에 따라 이용자정보를 다른 이용자의 개인정보와
              분리하여 별도로 저장 및 관리할 수 있습니다. 이때 분리 저장된 이용자의 개인정보는 이용자가
              회원탈퇴신청 또는 개인정보삭제 요청을 할때까지 보관됩니다.
              <br />
              3. 위원회가 이용자의 개인정보의 보호 및 사용에 대해서 관련 법규 및 위원회의
              개인정보처리방침을 적용합니다. 다만, 위원회에서 운영하는 웹 사이트 등에서 링크된 외부
              웹페이지에서는 위원회의 개인정보처리방침이 적용되지 않습니다.
              <br />
              <br />
              제12조(이용자의 의무)
              <br />
              1. 이용자는 이용자가입을 통해 이용신청을 하는 경우 사실에 근거하여 신청서를 작성해야
              합니다. 이용자가 허위, 또는 타인의 정보를 등록한 경우 위원회에 대하여 일체의 권리를 주장할
              수 없으며, 위원회는 이로 인하여 발생한 손해에 대하여 책임을 부담하지 않습니다.
              <br />
              2. 이용자는 본 약관에서 규정하는 사항과 기타 위원회가 정한 제반 규정, 위원회가 공지하는
              사항을 준수하여야 합니다. 또한 이용자는 위원회의 업무를 방해하는 행위 및 위원회의 명예를
              훼손하는 행위를 하여서는 안 됩니다.
              <br />
              3. 이용자는 주소, 연락처, 전자우편 주소 등 회원정보가 변경된 경우 즉시 온라인을 통해 이를
              수정해야 합니다. 이 때 변경된 정보를 수정하지 않거나 수정이 지연되어 발생하는 책임은
              이용자가 지게 됩니다.
              <br />
              4. 이용자는 이용자에게 부여된 아이디와 비밀번호를 직접 관리해야 합니다. 이용자의 관리
              소홀로 발생한 문제는 위원회가 책임을 부담하지 않습니다.
              <br />
              5. 이용자가 아이디, 닉네임, 기타 서비스 내에서 사용되는 명칭 등을 선정할 때에는 다음 각
              호에 해당하는 행위를 해서는 안 됩니다.
              <br />
              1. 위원회가 제공하는 서비스의 공식 운영자를 사칭하거나 이와 유사한 명칭을 사용하여 다른
              이용자에게 혼란을 주는 행위
              <br />
              2. 선정적이고 음란한 내용이 포함된 명칭을 사용하는 행위
              <br />
              3. 제3자의 상표권, 저작권 등 권리를 침해할 가능성이 있는 명칭을 사용하는 행위
              <br />
              4. 제3자의 명예를 훼손하거나, 그 업무를 방해할 가능성이 있는 명칭을 사용하는 행위
              <br />
              5. 기타 반사회적이고 관계법령에 저촉되는 내용이 포함된 명칭을 사용하는 행위
              <br />
              6. 이용자는 위원회의 명시적 동의가 없는 한 서비스 이용 권한, 기타 이용 계약상의 지위에
              대하여 매도, 증여, 담보제공 등 처분행위를 할 수 없습니다.
              <br />
              7. 본 조와 관련하여 서비스 이용에 있어 주의사항 등 그 밖의 자세한 내용은 운영정책으로
              정하며, 이용자가 서비스 이용약관 및 운영정책을 위반하는 경우 서비스 이용제한, 민형사상의
              책임 등 불이익이 발생할 수 있습니다.
              <br />
              <br />
              제13조(서비스의 제공)
              <br />
              1. 위원회의 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다. 다만 위원회 시스템의
              유지 보수를 위한 점검, 통신장비의 교체 등 특별한 사유가 있는 경우 서비스의 전부 또는
              일부에 대하여 일시적인 제공 중단이 발생할 수 있습니다.
              <br />
              2. 위원회가 제공하는 개별 서비스에 대한 구체적인 안내사항은 개별 서비스 화면에서 확인할 수
              있습니다.
              <br />
              3. 위원회가 제공하는 서비스의 내용은 다음과 같습니다.
              <br />
              1. 구성원들 간의 커뮤니티 서비스
              <br />
              2. 중앙대학교 소프트웨어학부 학생회 측에서 운영하는 모든 행사 및 사업의 공지 및 신청 등
              <br />
              <br />
              제14조(서비스의 제한 등)
              <br />
              1. 위원회는 전시, 사변, 천재지변 또는 이에 준하는 국가비상사태가 발생하거나 발생할 우려가
              있는 경우와 전기통신사업법에 의한 기간통신사업자가 전기통신서비스를 중지하는 등 부득이한
              사유가 있는 경우에는 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.
              <br />
              2. 무료서비스는 전항의 규정에도 불구하고, 위원회의 운영정책 등의 사유로 서비스의 전부 또는
              일부가 제한되거나 중지될 수 있으며, 유료로 전환될 수 있습니다.
              <br />
              3. 위원회는 서비스의 이용을 제한하거나 정지하는 때에는 그 사유 및 제한기간, 예정 일시 등을
              지체없이 이용자에게 알립니다.
              <br />
              4. 위원회는 사전에 결제정보를 입력 받고, 무료로 제공중인 서비스를 유료로 전환할 경우, 그
              사유와 유료 전환 예정 일시를 통지하고 유료 전환에 대한 이용자의 동의를 받습니다.
              <br />
              <br />
              제15조(서비스의 해제·해지 및 탈퇴 절차)
              <br />
              1. 이용자가 이용 계약을 해지하고자 할 때는 언제든지 홈페이지 상의 이용자 탈퇴 신청을 통해
              이용계약 해지를 요청할 수 있습니다. 단, 신규가입 후 일정 시간 동안 서비스 부정이용 방지
              등의 사유로 즉시 탈퇴가 제한될 수 있습니다.
              <br />
              2. 위원회는 이용자가 본 약관에서 정한 이용자의 의무를 위반한 경우 등 비정상적인 이용 또는
              부당한 이용과 이용자 금지프로그램 사용하는 경우 또는 타인의 명예를 훼손하거나 모욕하는
              방송과 게시물을 작성한 경우 이러한 행위를 금지하거나 삭제를 요청하였음에도 불구하고 최초의
              금지 또는 삭제 요청을 포함하여 2회 이상 누적되는 경우 이용자에게 통지하고, 계약을 해지할
              수 있습니다.
              <br />
              3. 위원회는 이용자의 청약철회, 해제 또는 해지의 의사표시를 수신한 후 그 사실을 이용자에게
              회신합니다. 회신은 이용자가 위원회에 대하여 통지한 방법 중 하나에 의하고, 이용자가
              위원회에 대하여 통지한 연락처가 존재하지 않는 경우에는 회신하지 않을 수 있습니다.
              <br />
              <br />
              제16조(손해배상)
              <br />
              1. 위원회 또는 이용자는 상대방의 귀책에 따라 손해가 발생하는 경우 손해배상을 청구할 수
              있습니다. 다만, 위원회는 무료서비스의 장애, 제공 중단, 보관된 자료 멸실 또는 삭제, 변조
              등으로 인한 손해에 대하여는 배상책임을 부담하지 않습니다.
              <br />
              2. 위원회가 제공하는 서비스의 이용과 관련하여 위원회의 운영정책 및 개인 정보 보호정책,
              기타 서비스별 이용약관에서 정하는 내용에 위반하지 않는 한 위원회는 어떠한 손해에 대하여도
              책임을 부담하지 않습니다.
              <br />
              <br />
              제17조(면책사항)
              <br />
              1. 위원회는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
              서비스 제공에 관한 책임을 지지 않습니다.
              <br />
              2. 위원회는 이용자의 귀책사유로 인한 서비스 이용장애에 대하여 책임을 지지 지 않습니다.
              <br />
              3. 위원회는 이용자가 서비스를 이용하며 기대하는 수익을 얻지 못한 것에 대하여 책임 지지
              않으며 서비스를 통하여 얻은 자료로 인한 손해 등에 대하여도 책임을 지지 않습니다.
              <br />
              4. 위원회는 이용자가 웹페이지에 게재한 내용의 신뢰도, 정확성 등 내용에 대해서는 책임지지
              않으며, 이용자 상호간 또는 이용자와 제3자 상호간 서비스를 매개로 발생한 분쟁에 개입하지
              않습니다.
              <br />
              <br />
              제18조(정보의 제공 및 광고의 게재)
              <br />
              1. 위원회는 이용자가 서비스 이용 중 필요하다고 인정되는 각종 정보 및 광고를 배너 게재,
              전자우편(E-Mail), 휴대폰 메세지, 전화, 우편 등의 방법으로 이용자에게 제공(또는 전송)할 수
              있습니다. 다만, 이용자는 이를 원하지 않을 경우 위원회가 제공하는 방법에 따라 수신을 거부할
              수 있습니다.
              <br />
              2. 이용자가 수신 거부를 한 경우에도 이용약관, 개인정보보호정책, 기타 이용자의 이익에
              영향을 미칠 수 있는 중요한 사항의 변경 등 '정보통신망이용촉진 및 정보보호 등에 관한
              법률'에서 정하는 사유 등 이용자가 반드시 알고 있어야 하는 사항에 대하여는 전자우편 등의
              방법으로 정보를 제공할 수 있습니다.
              <br />
              3. 제1항 단서에 따라 이용자가 수신 거부 조치를 취한 경우 이로 인하여 위원회가 거래 관련
              정보, 이용 문의에 대한 답변 등의 정보를 전달하지 못한 경우 위원회는 이로 인한 책임이
              없습니다.
              <br />
              4. 위원회는 광고주의 판촉 활동에 이용자가 참여하거나, 거래의 결과로서 발생하는 손실 또는
              손해에 대하여는 책임을 지지 않습니다.
              <br />
              <br />
              제19조(권리의 귀속)
              <br />
              1. 위원회가 제공하는 서비스에 대한 저작권 등 지식재산권은 위원회에 귀속 됩니다.
              <br />
              2. 위원회는 서비스와 관련하여 이용자에게 위원회가 정한 조건 따라 위원회가 제공하는
              서비스를 이용할 수 있는 권한만을 부여하며, 이용자는 이를 양도, 판매, 담보제공 하는 등
              처분행위를 할 수 없습니다.
              <br />
              3. 제1항의 규정에도 불구하고 이용자가 직접 작성한 콘텐츠 및 위원회의 제휴계약에 따라
              제공된 저작물에 대한 지식재산권은 위원회에 귀속되지 않습니다.
              <br />
              <br />
              제20조(콘텐츠의 관리)
              <br />
              1. 회원이 작성 또는 창작한 콘텐츠가 '개인정보보호법' 및 '저작권법' 등 관련 법에 위반되는
              내용을 포함하는 경우, 관리자는 관련 법이 정한 절차에 따라 해당 콘텐츠의 게시중단 및 삭제
              등을 요청할 수 있으며, 위원회는 관련 법에 따라 조치를 취하여야 합니다.
              <br />
              2. 위원회는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나
              기타 위원회 정책 및 관련 법에 위반되는 경우에는 관련 법에 따라 해당 콘텐츠에 대해 임시조치
              등을 취할 수 있습니다.
              <br />
              <br />
              제21조(콘텐츠의 저작권)
              <br />
              1. 이용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 콘텐츠의 저작자에게 귀속됩니다.
              <br />
              2. 제1항에 불구하고 위원회는 서비스의 운영, 전시, 전송, 배포, 홍보 등의 목적으로 별도의
              허락 없이 무상으로 저작권법 및 공정한 거래관행에 합치되는 범위 내에서 다음 각 호와 같이
              회원이 등록한 콘텐츠를 사용할 수 있습니다.
              <br />
              1. 서비스 내에서 이용자가 작성한 콘텐츠의 복제, 수정, 전시, 전송, 배포 등 저작권을
              침해하지 않는 범위 내의 2차적저작물 또는 편집 저작물 작성을 위한 사용. 다만, 해당 콘텐츠를
              등록한 이용자가 해당 콘텐츠의 삭제 또는 사용 중지를 요청하는 경우 위원회는 관련 법에 따라
              보존해야하는 사항을 제외하고 관련 콘텐츠를 모두 삭제 또는 사용중지합니다.
              <br />
              2. 서비스의 운영, 홍보, 서비스 개선 및 새로운 서비스 개발을 위한 범위 내의 사용
              <br />
              3. 미디어, 통신사 등을 통한 홍보목적으로 이용자의 콘텐츠를 제공, 전시하도록 하는 등의
              사용.
              <br />
              <br />
              제22조(관할법원 및 준거법)
              <br />
              서비스와 관련하여 분쟁이 발생한 경우 관할법원은 위원회 소재지 관할법원으로 정하며,
              준거법은 대한민국의 법령을 적용합니다.
              <br />
              <br />
              <br />
              <div>부 칙</div>
              <br />
              제1조(시행일)
              <br />본 약관은 2024.03.07부터 시행됩니다.  <br />
              <br />
              게시물 운영정책
              <br />본 서비스의 부득이 일정한 내용의 게시물은 게재가 제한될 수 있습니다.
              <br />
              1. 다른 이용자 또는 공공의 안전에 직접적인 위험을 일으키고 있다고 의심되는 경우
              <br />
              2. 다른 이용자의 권리를 보호하지 않는 경우
              <br />
              3. 다른 이용자를 존중하지 않는 경우
              <br />
              4. 서비스의 기능을 비정상적으로 이용하여 게재했거나 동문네트워크 서비스의 제공 취지와
              부합하지 않는 내용을 가진 경우
              <br />
              5. 대한민국 법률에 어긋나는 경우
              <br />
              6. 기타 운영진의 판단 하의 부적절하다고 여겨지는 경우  <br />
              <br />
              개인정보처리동의서
              <br />
              중앙대학교 소프트웨어학부 특별기구 ICT위원회(이하 '위원회'라고 합니다)는 개인정보보호법 등
              관련 법령상의 개인정보보호 규정을 준수하며 귀하의 개인정보보호에 최선을 다하고 있습니다.
              위원회는 개인정보보호법에 근거하여 다음과 같은 내용으로 개인정보를 수집 및 처리하고자
              합니다.
              <br />
              <br />
              다음의 내용을 자세히 읽어보시고 모든 내용을 이해하신 후에 동의 여부를 결정해주시기
              바랍니다.
              <br />
              <br />
              제1조(개인정보 수집 및 이용 목적)
              <br />
              이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 목적 이외의 용도로는 사용되지
              않습니다.
              <br />- 본인확인 및 기타 서비스 운영에 필요한 사용자의 행사/사업 신청 정보
              <br />
              <br />
              제2조(개인정보 수집 및 이용 항목)
              <br />
              위원회는 개인정보 수집 목적을 위하여 다음과 같은 정보를 수집합니다.
              <br />- 성명, 주소, 전화번호, 이메일, 성별, 나이, 생년월일 및 학적, 학번
              <br />
              <br />
              제3조(개인정보 보유 및 이용 기간)
              <br />
              1. 수집한 개인정보는 수집·이용 동의일로부터 횡원 탈퇴 이후 5년 보관 및 이용합니다.
              <br />
              2. 개인정보 보유기간의 경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는
              지체없이 해당 개인정보를 파기합니다.
              <br />
              <br />
              제4조(동의 거부 관리)
              <br />
              귀하는 본 안내에 따른 개인정보 수집·이용에 대하여 동의를 거부할 권리가 있습니다. 다만,
              귀하가 개인정보 동의를 거부하시는 경우에 서비스 사용의 불이익이 발생할 수 있음을
              알려드립니다.
              <br />
              <br />
              본인은 위의 동의서 내용을 충분히 숙지하였으며,위와 같이 개인정보를 수집·이용하는데
              동의합니다.
              <br />
              <br />
              제5조(개인정보의 제3자 제공)
              <br />
              위원회는 개인정보보호법에 근거하여 다음과 같은 내용으로 개인정보를 제3자에게 제공하고자
              합니다.
              <br />
              1. 개인정보를 제공 받는 제3자 : 중앙대학교 소프트웨어학부 학생회 및 동문회
              <br />
              2. 개인정보 제공 목적 : 본인 확인, 행사/사업 진행
              <br />
              3. 개인정보 제공 항목 : 성명, 주소, 전화번호, 이메일, 성별, 나이, 생년월일 및 학적, 학번
              <br />
              4. 개인정보 보유 및 이용기간 : 회원 탈퇴 이후 5년
              <br />
              5. 개인정보 제공 거부 시 불이익 : 서비스 이용 제한
            </div>
          </div>
          <div className="flex items-center ml-4 mt-4">
          <input type="checkbox" className="mr-2" {...register('agreeToPopup', { 
            required: '(약관에 동의해주세요)',
            onChange: (e) => handleCheckboxChange(e.target.checked)
          })}/>
          <label htmlFor="terms">
            <label className="text-gray-700 sm:text-xl text-lg cursor-pointer" onClick={openModal}>
            위 약관과 정책 및 개인정보처리에 동의합니다.
            </label>
          </label>
          </div>

      </>
      </div>
      <div className='w-full flex items-center justify-center'>
        <button
          onClick={closeModal}
          className="mt-4 bg-focus hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
)}
</div>)};

export default SignUpPage;