import * as React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FaSearch, FaBookOpen } from "react-icons/fa";

const TopImage = ({ buttonClick }: any) => {
  const router = useRouter();
  
  return (
    <div className="relative w-full bg-white overflow-hidden">
      {/* 背景装飾 - 和紙のようなテクスチャ感と柔らかなグラデーション */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-pink-100 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-50 blur-3xl" />
      </div>
      
      {/* グリッドパターン（うっすらと） */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* 左側：テキストエリア */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-sm font-medium mb-2">
                <span className="flex h-2 w-2 rounded-full bg-pink-500"></span>
                日本最大級の戯曲検索データベース
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
                物語との<br className="md:hidden" />
                <span className="relative inline-block">
                  出会い
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-pink-200/50 -z-10 transform -rotate-1"></span>
                </span>
                を、<br />
                もっと自由に。
              </h1>
              
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0 font-sans">
                上演時間、人数、ジャンルから。<br />
                あなたの劇団にぴったりの脚本が、<br className="md:hidden"/>きっと見つかる。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <button
                className="group relative inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                onClick={buttonClick}
              >
                <FaSearch className="text-pink-400 group-hover:scale-110 transition-transform" />
                <span>脚本を探す</span>
                <span className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></span>
              </button>
              
              <button 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-lg font-medium text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 min-w-[200px]"
                onClick={() => router.push('/support/about')}
              >
                <FaBookOpen className="text-gray-400" />
                <span>初めての方へ</span>
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-6 font-sans">
              ※ 当サイトは戯曲の検索データベースです。本文の閲覧には各出版社のサイトをご利用ください。
            </p>
          </div>

          {/* 右側：ビジュアルエリア */}
          <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px] w-full flex items-center justify-center">
            {/* メインイラスト */}
            <div className="relative w-full h-full max-w-[500px] max-h-[500px]">
              <Image
                src="/readbookman.svg"
                alt="本を読む人"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            
            {/* 装飾的な浮遊要素（カードなど） */}
            <div className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-xl border border-gray-100 hidden lg:block animate-float-slow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <span className="font-serif font-bold">劇</span>
                </div>
                <div>
                  <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 w-12 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="h-16 w-32 bg-gray-50 rounded mb-2"></div>
              <div className="flex justify-between">
                <div className="h-2 w-8 bg-pink-100 rounded"></div>
                <div className="h-2 w-8 bg-blue-100 rounded"></div>
              </div>
            </div>

             <div className="absolute bottom-20 left-0 bg-white p-3 rounded-lg shadow-lg border border-gray-100 hidden lg:block animate-float-delayed">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                 <span className="text-xs font-bold text-gray-700">登録作品数 1,000+</span>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* 下部の波形シェイプ */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none text-gray-50">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] md:h-[100px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div>
      
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
};

export default TopImage;