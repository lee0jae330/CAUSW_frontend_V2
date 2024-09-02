import React, { useState, useRef, useEffect } from 'react';
import Image from "next/image";

interface VotingSectionProps {
  isResult: boolean;
  options: string[];
  totalVotes?: number;
  voteResult?: { name: string; votes: number }[];
  isMultiple: boolean;
  isAnonymous: boolean;
  onVote: (selectedOptions: string[]) => void;
}

const VotingSection: React.FC<VotingSectionProps> = ({ isResult, options, totalVotes, voteResult, isMultiple, isAnonymous, onVote }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleChange = (option: string) => {
    if (isMultiple) {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((o) => o !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      onVote(selectedOptions);
    } else {
      //api 작동 안하도록 하기
      console.log('선택안함');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-center">
        <div className="w-[70px] text-[14px] text-center">{isResult ? `총 ${totalVotes}명` : ''}</div>
        <div className="text-red-500 w-max-[300px] bg-vote-title px-4 py-2 text-[14px] font-semibold text-center">투표: 상품 누군가한테 줄까요?</div>
        <div className="text-gray-500 w-[70px] border-b-comment-bw text-[14px] text-center border-black mr-2">{isAnonymous ? '익명':''} {isMultiple ? '복수' : ''}</div>
      </div>
      {isResult
      ?<div className="relative mb-4 bg-white border-comment-bw border-black p-3 rounded-lg space-y-3">
        <button className="absolute top-0 right-0 flex items-center justify-center w-10 h-10" onClick={toggleMenu}>
          <Image
            src="/images/post/comment-menu.svg"
            alt="Comment Menu"
            width={4}
            height={4}
          ></Image>
        </button>
        {isMenuOpen && 
          <div className="absolute top-0 right-8 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              투표 현황 보기
            </button>
            <hr className="border-gray-300" />
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              투표 재시작
            </button>
          </div>
        }
        {voteResult!.map((voteResult) => {
          const percentage = (voteResult.votes / totalVotes!) * 100;
          return (
            <div key={voteResult.name} className="flex flex-col pt-4 mx-1">
              <div className="flex items-center">
                {/* TODO: winner일 때만 표시되도록 하기 */}
                <Image
                  src="/images/post/vote-winner.svg"
                  alt="Vote Winner"
                  width={20}
                  height={20}
                  className="my-2 ml-0 mr-4"
                ></Image>
                <span className="text-[16px] flex-1">{voteResult.name}</span>
                <span className="text-[14px]">{voteResult.votes}명</span>
              </div>
              <span className="flex-1">
                <div className="relative w-full h-2 bg-gray-300 rounded">
                  <div
                    className="absolute top-0 left-0 h-full bg-vote-theme rounded"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </span>
            </div>
          );
        })}
      </div>
      // relative mb-4 bg-white border-comment-bw border-black p-3 rounded-lg space-y-3
      :<div className="relative mb-4 bg-white border-comment-bw border-black pt-6 p-3 rounded-lg">
        <button className="absolute top-0 right-0 flex items-center justify-center w-10 h-10" onClick={toggleMenu}>
          <Image
            src="/images/post/comment-menu.svg"
            alt="Comment Menu"
            width={4}
            height={4}
          ></Image>
        </button>
        {isMenuOpen && 
          <div className="absolute top-0 right-8 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              투표 현황 보기
            </button>
            <hr className="border-gray-300" />
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              투표 종료
            </button>
          </div>
        }
        {options.map((option) => (
          <label key={option} className="flex items-center mb-4">
            <input
              type="checkbox"
              name="vote"
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="hidden"
            />
            <span
              className={`inline-block w-[20px] h-[20px] mr-3 rounded-full transition-all duration-200 border-black border-comment-bw ${
                selectedOptions.includes(option)
                  ?  'bg-vote-theme shadow-vote-option'
                  : ''
              }`}
            />
            <span className='text-[16px]'>{option}</span>
          </label>
        ))}
        <button
          onClick={handleVote}
          className="mt-4 bg-vote-theme w-full text-white text-[16px] py-3 rounded-lg"
        >
          투표하기
        </button>
      </div>
      }
    </div>
  );
};

export default VotingSection;
