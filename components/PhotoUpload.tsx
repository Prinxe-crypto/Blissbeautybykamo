
import React, { useState } from 'react';

interface PhotoUploadProps {
  photos: string[];
  onUpload: (newPhotos: string[]) => void;
  onDelete: (index: number) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onUpload, onDelete }) => {
  const [isReading, setIsReading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsReading(true);
      // Fix: Explicitly cast Array.from result to File[] to ensure 'file' is inferred as File/Blob rather than unknown.
      const files = Array.from(e.target.files) as File[];
      
      try {
        // Convert each file to a Base64 string for persistent storage
        const base64Photos = await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
              // file is now correctly typed as File, which is a subclass of Blob.
              reader.readAsDataURL(file);
            });
          })
        );
        
        onUpload(base64Photos);
      } catch (error) {
        console.error("Error reading files:", error);
        alert("There was an error processing your images. Please try again.");
      } finally {
        setIsReading(false);
        // Reset input value so the same file can be uploaded again if deleted
        e.target.value = '';
      }
    }
  };

  return (
    <section id="upload" className="py-24 scroll-mt-20" style={{ backgroundColor: 'var(--theme-bg-main)', borderTopColor: 'var(--theme-border)', borderBottomColor: 'var(--theme-border)' }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.5em] mb-4 block" style={{ color: 'var(--theme-accent)' }}>Salon Management</span>
        <h2 className="text-4xl md:text-5xl font-bold serif italic mb-8" style={{ color: 'var(--theme-text-main)' }}>Update Your Portfolio</h2>
        <p className="mb-12 max-w-xl mx-auto text-sm md:text-base italic" style={{ color: 'var(--theme-text-muted)' }}>
          Upload your latest sets here. They will be saved permanently as Base64 data and will appear in the "Latest Work" section.
        </p>

        <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-[3rem] shadow-xl border" style={{ backgroundColor: 'var(--theme-bg-surface)', borderColor: 'var(--theme-border)' }}>
            <div className="mb-10">
                <label 
                    htmlFor="photo-upload" 
                    className={`cursor-pointer inline-flex items-center gap-3 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:brightness-110 hover:-translate-y-1 ${isReading ? 'opacity-50 pointer-events-none' : ''}`}
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                >
                    {isReading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Add New Masterpieces
                      </>
                    )}
                </label>
                <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>

            {photos.length === 0 ? (
                <div className="h-48 md:h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-main)' }}>
                    <svg className="w-10 h-10 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-main)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="font-medium text-sm opacity-40" style={{ color: 'var(--theme-text-muted)' }}>Upload photos to populate your gallery</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
                    {photos.map((photo, index) => (
                        <div key={index} className="relative aspect-square group overflow-hidden rounded-2xl shadow-sm border bg-stone-200" style={{ borderColor: 'var(--theme-border)' }}>
                            <img
                                src={photo}
                                alt={`User Upload ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                            <button 
                                onClick={() => onDelete(index)}
                                className="absolute top-2 right-2 p-2 text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                aria-label="Delete masterpiece"
                                style={{ backgroundColor: 'var(--theme-primary)' }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[8px] py-1.5 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                Masterpiece #{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default PhotoUpload;
