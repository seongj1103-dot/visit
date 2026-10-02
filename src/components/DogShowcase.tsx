import { DOG_BREEDS } from '../constants/dogs';
import { DogBreed } from '../types';
import { playPuppyWoof } from '../utils/audio';

interface DogShowcaseProps {
  onSelectBreedForMessage: (breed: DogBreed) => void;
}

export function DogShowcase({ onSelectBreedForMessage }: DogShowcaseProps) {
  const breeds = Object.values(DOG_BREEDS);

  return (
    <section id="dogs-section" className="scroll-mt-20 py-8">
      <div className="bg-amber-100/40 rounded-2xl border border-amber-200/60 p-6 sm:p-8">
        
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-2">
            <span>🐾</span>
            <span>멍멍 패밀리</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-gaegu">
            방명록을 빛내주는 강아지 친구들
          </h2>
          <p className="text-xs text-slate-600 mt-1.5">
            마음에 드는 강아지를 클릭하면 그 친구의 모습으로 응원 메시지를 남길 수 있어요!
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {breeds.map((breed) => (
            <button
              key={breed.id}
              onClick={() => {
                playPuppyWoof();
                onSelectBreedForMessage(breed.id);
              }}
              className="bg-white rounded-xl p-3.5 border border-amber-200/60 shadow-xs hover:shadow-md hover:border-amber-400 hover:-translate-y-1 transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-50 mb-2 border border-amber-200 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={breed.avatarUrl}
                  alt={breed.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-bold text-slate-900 leading-tight">
                {breed.name}
              </span>
              <span className="text-[11px] text-amber-800 font-medium mt-0.5">
                {breed.emoji}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                {breed.tagline}
              </p>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
