import { BannerCard } from "@/entities/home";
import { HomeRscService } from "@/shared";
import Link from "next/link";

export default async function EventSetting() {
  const { getEvents } = HomeRscService();

  let events;
  try {
    events = await getEvents();
  } catch (e: any) {
    console.error(e.message);
  }

  return (
    <div className="flex h-full w-full flex-col gap-10 p-8">
      <div className="flex justify-between">
        <Link href=".." className="flex items-center">
          <i className="icon-[ooui--next-rtl]" />
          이전
        </Link>
        <Link
          href="./event/new"
          className="rounded-full border border-black bg-white px-8 py-3"
        >
          배너 추가
        </Link>
      </div>
      <div className="flex items-end">
        <p className="text-[40px] font-medium">이벤트 배너 공지 편집</p>
        <span className="text-[#B4B1B1]">
          이벤트 배너는 최대 10개까지 게시 가능합니다.
        </span>
      </div>
      <BannerCard
        url="https//:~~"
        imgSrc="/images/calendar-dummy.png"
        bannerId="1"
        date="2021.09.01"
      />
      <BannerCard
        url="https//:~~"
        imgSrc="/images/calendar-dummy.png"
        bannerId=""
        date="2021.09.01"
      />
      <BannerCard
        url="https//:~~"
        imgSrc="/images/calendar-dummy.png"
        bannerId="2"
        date="2021.09.01"
      />
      <BannerCard
        url="https//:~~"
        imgSrc="/images/calendar-dummy.png"
        bannerId="3"
        date="2021.09.01"
      />
      <BannerCard
        url="https//:~~"
        imgSrc="/images/calendar-dummy.png"
        bannerId="4"
        date="2021.09.01"
      />
      {events && <p>TODO : 실제 이벤트 목록</p>}
    </div>
  );
}
