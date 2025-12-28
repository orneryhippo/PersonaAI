
import React, { useState, useCallback, useRef } from 'react';
import { APP_NAME, HEADSHOT_STYLES } from './constants';
import { HeadshotStyle, AppState, ImageResult } from './types';
import { Button } from './components/Button';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [selectedStyle, setSelectedStyle] = useState<HeadshotStyle | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalMime, setOriginalMime] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string);
        setOriginalMime(file.type);
        setAppState('IDLE');
      };
      reader.readAsDataURL(file);
    }
  };

  const getBase64FromDataUrl = (dataUrl: string) => {
    return dataUrl.split(',')[1];
  };

  const generateHeadshot = async () => {
    if (!originalImage || !selectedStyle || !originalMime) return;

    setAppState('GENERATING');
    setError(null);
    setLoadingMessage(`Tailoring your ${selectedStyle.label} headshot...`);

    try {
      const base64 = getBase64FromDataUrl(originalImage);
      const generatedUrl = await geminiService.transformImage(
        base64,
        originalMime,
        selectedStyle.prompt
      );
      setResultImage(generatedUrl);
      setAppState('RESULT');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate headshot. Please try again.");
      setAppState('IDLE');
    }
  };

  const applyEdit = async () => {
    if (!resultImage || !editPrompt) return;

    setAppState('EDITING');
    setError(null);
    setLoadingMessage(`Applying edits: "${editPrompt}"...`);

    try {
      // Use the current result image as the base for the edit
      const base64 = getBase64FromDataUrl(resultImage);
      // For editing, we assume PNG output from our service
      const editedUrl = await geminiService.transformImage(
        base64,
        'image/png',
        editPrompt
      );
      setResultImage(editedUrl);
      setAppState('RESULT');
      setEditPrompt('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to apply edit. Try a different prompt.");
      setAppState('RESULT'); // Stay on result screen
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setSelectedStyle(null);
    setAppState('IDLE');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">{APP_NAME}</span>
        </div>
        <div className="hidden sm:block text-sm text-gray-500 font-medium">
          Powered by Gemini 2.5 Flash
        </div>
      </nav>

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
        {/* Step-based Wizard UI */}
        
        {!originalImage && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-700">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                Your professional headshot is <br/>
                <span className="text-indigo-600">just a selfie away.</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg mx-auto">
                No studio, no photographer, no expensive gear. Just upload a casual photo and let AI do the magic.
              </p>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-gray-300 rounded-3xl p-16 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />
              <div className="space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Click to upload your photo</p>
                  <p className="text-gray-500">A clear, well-lit selfie works best</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {originalImage && !resultImage && appState !== 'GENERATING' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in slide-in-from-bottom-4 duration-500">
            {/* Left Column: Preview Original */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Photo</h2>
                <button 
                  onClick={() => setOriginalImage(null)}
                  className="text-sm text-red-600 font-medium hover:underline"
                >
                  Change Photo
                </button>
              </div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
                <img src={originalImage} alt="Original" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right Column: Style Selection */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Choose a Style</h2>
                <p className="text-gray-600">Select the vibe you want for your professional headshot.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HEADSHOT_STYLES.map((style) => (
                  <div 
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      selectedStyle?.id === style.id 
                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <img src={style.previewUrl} alt={style.label} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{style.label}</p>
                      <p className="text-xs text-gray-500">{style.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Button 
                  onClick={generateHeadshot}
                  disabled={!selectedStyle}
                  className="w-full py-4 text-lg"
                  isLoading={appState === 'GENERATING'}
                >
                  Generate Professional Headshot
                </Button>
                {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(appState === 'GENERATING' || appState === 'EDITING') && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-300">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{loadingMessage}</h3>
              <p className="text-gray-500 animate-pulse">Our AI photographer is adjusting the lighting and retouching...</p>
            </div>
          </div>
        )}

        {/* Result State */}
        {resultImage && appState !== 'GENERATING' && appState !== 'EDITING' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-in zoom-in-95 duration-500">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Result</h2>
                <div className="flex gap-4">
                   <a 
                    href={resultImage} 
                    download="headshot.png"
                    className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                  <button 
                    onClick={reset}
                    className="text-sm text-gray-500 font-medium hover:underline"
                  >
                    Start Over
                  </button>
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 border-4 border-white ring-1 ring-gray-200">
                <img src={resultImage} alt="Generated Headshot" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-8 lg:mt-12">
              <div className="bg-indigo-600 rounded-3xl p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                <div className="relative">
                  <h3 className="text-2xl font-bold">Ask AI to Refine</h3>
                  <p className="text-indigo-100 text-sm mt-1">Want to tweak something? Just tell us.</p>
                </div>

                <div className="space-y-4 relative">
                  <textarea 
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder='Try "Add a soft vintage filter", "Brighten the background", or "Change the tie color to navy blue"'
                    className="w-full bg-indigo-500/50 border border-indigo-400 rounded-2xl p-4 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none h-32"
                  />
                  <Button 
                    variant="secondary"
                    className="w-full text-indigo-700 bg-white hover:bg-indigo-50"
                    disabled={!editPrompt}
                    onClick={applyEdit}
                  >
                    Apply Magic Edit
                  </Button>
                </div>
                
                {error && <p className="text-red-200 text-sm font-medium">{error}</p>}

                <div className="pt-4 border-t border-indigo-500 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider block w-full mb-1">Quick Suggestions</span>
                  {["Warm sunlight", "Black & white", "Blue tones", "Minimalist background"].map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => setEditPrompt(suggestion)}
                      className="px-3 py-1 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-full text-xs transition-colors border border-indigo-400/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    Complete
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Style</p>
                  <p className="text-gray-900 font-bold">{selectedStyle?.label}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <div className="bg-gray-900 p-1.5 rounded text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 tracking-tight">{APP_NAME} Studio</span>
            </div>
            <p className="text-sm text-gray-500">Expert-quality professional headshots powered by advanced AI.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
