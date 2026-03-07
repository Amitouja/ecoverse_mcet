import Image from 'next/image';

export default function Categories() {
  return (
    <section className="px-6 py-24 md:px-[52px] md:py-32 bg-bg2 border-b border-ink/10">
      <div className="text-center mb-16">
        <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-fern/60 block mb-4 flex items-center justify-center gap-2 before:content-[''] before:w-6 before:h-[1px] before:bg-fern/40 after:content-[''] after:w-6 after:h-[1px] after:bg-fern/40">
          SHOP BY CATEGORY
        </span>
        <h2 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.01em] text-ink leading-[1.1]">
          What are you <em className="italic text-fern block">looking for?</em>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { bg: 'bg-gradient-to-br from-[#c8d8c0] to-[#b8c8b0]', title: 'Tops & Tees', items: '24 items' },
          { bg: 'bg-gradient-to-br from-[#d8c8b0] to-[#c8b8a0]', title: 'Bottoms', items: '18 items' },
          { bg: 'bg-gradient-to-br from-[#c0c8d8] to-[#b0b8c8]', title: 'Outerwear', items: '12 items' },
          { bg: 'bg-gradient-to-br from-[#d0c8d8] to-[#c0b8c8]', title: 'Footwear', items: '9 items' }
        ].map((category, idx) => (
          <div 
            key={idx}
            className={`aspect-square flex flex-col items-center justify-center gap-3 relative overflow-hidden cursor-pointer rounded-xl transition-all duration-300 group hover:shadow-[0_12px_40px_rgba(26,26,20,0.12)] hover:-translate-y-1 ${category.bg}`}
          >
            {idx === 0 && <Image src="/stack.jpeg" alt={category.title} width={200} height={200} className="w-[60%] h-[60%] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />}
            {idx === 1 && <Image src="/bottoms.jpeg" alt={category.title} width={200} height={200} className="w-[60%] h-[60%] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />}
            {idx === 2 && <Image src="/jacket.jpeg" alt={category.title} width={200} height={200} className="w-[60%] h-[60%] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />}
            {idx === 3 && <Image src="/sneaker.jpeg" alt={category.title} width={200} height={200} className="w-[60%] h-[60%] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />}
            <div className="text-center">
              <div className="font-playfair font-bold text-[1.1rem] text-ink">
                {category.title}
              </div>
              <div className="font-jost text-[0.8rem] text-ink/60 font-medium">
                {category.items}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
