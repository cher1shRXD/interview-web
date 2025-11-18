import Input from "../components/Input";

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-16">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-semibold text-text">안녕하세요, 마이인터뷰입니다.</h1>
        <p className="text-xl font-medium text-text">포트폴리오를 첨부하고 30초 만에 예상 질문을 받아보세요!</p>
      </div>

      <Input />
    </div>
  );
};

export default Home;
