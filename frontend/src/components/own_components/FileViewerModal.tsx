import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  fileType
}) => {
  const [pdfError, setPdfError] = React.useState(false);

  // Prevent right-click context menu and keyboard shortcuts for downloading
  const preventDownload = (e: Event) => {
    e.preventDefault();
  };

  const preventKeyboardShortcuts = (e: KeyboardEvent) => {
    // Prevent Ctrl+S (Save), Ctrl+A (Select All), etc.
    if (e.ctrlKey && (e.key === 's' || e.key === 'a' || e.key === 'p')) {
      e.preventDefault();
    }
    // Prevent F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    // Reset PDF error state when modal opens
    if (isOpen) {
      setPdfError(false);
      document.addEventListener('contextmenu', preventDownload);
      document.addEventListener('keydown', preventKeyboardShortcuts);
      // Disable text selection
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('contextmenu', preventDownload);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.body.style.userSelect = '';
    };
  }, [isOpen]);

  // Determine file category
  const getFileCategory = (type: string) => {
    const lowerType = type?.toLowerCase();
    
    if (lowerType?.includes('pdf') || lowerType === 'pdf') return 'pdf';
    if (lowerType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'image'].includes(lowerType)) return 'image';
    if (lowerType?.includes('word') || lowerType?.includes('document') || ['doc', 'docx'].includes(lowerType)) return 'document';
    if (lowerType?.includes('sheet') || lowerType?.includes('excel') || ['xls', 'xlsx'].includes(lowerType)) return 'spreadsheet';
    if (lowerType?.includes('presentation') || lowerType?.includes('powerpoint') || ['ppt', 'pptx'].includes(lowerType)) return 'presentation';
    if (lowerType?.includes('text') || lowerType === 'txt') return 'text';
    
    return 'other';
  };

  const fileCategory = getFileCategory(fileType);
  
  // Check if browser might block PDFs (simple user agent check)
  const isBrave = navigator.userAgent.includes('Brave') || 
                  // Brave detection without direct property access
                  (navigator.userAgent.includes('Chrome') && 
                   typeof (navigator as any).brave !== 'undefined');

  const renderFileContent = () => {
    switch (fileCategory) {
      case 'pdf':
        if (pdfError) {
          return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">PDF Viewer Blocked</h3>
                <p className="text-gray-600 mb-4">
                  Your browser has blocked the PDF viewer. This is a security feature in some browsers like Brave.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  File: {fileName}
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg max-w-md">
                <h4 className="font-semibold text-blue-800 mb-2">How to view this PDF:</h4>
                <ul className="list-decimal list-inside text-left text-blue-700 text-sm space-y-1">
                  <li>Disable shields/blocking for this site</li>
                  <li>Use a different browser (Chrome, Firefox, Safari)</li>
                  <li>Enable PDF viewing in browser settings</li>
                  <li>Contact your administrator for access</li>
                </ul>
                <button
                  onClick={() => setPdfError(false)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }
        
        return (
          <div className="relative w-full h-full min-h-[600px]">
            {/* Warning for Brave users */}
            {isBrave && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 mb-2 rounded">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Brave browser may block PDF viewing. If you see a blank area below, please disable Brave shields for this site.
                </p>
              </div>
            )}
            
            {/* Primary PDF viewer using embed tag for better compatibility */}
            <embed
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
              type="application/pdf"
              className="w-full h-full min-h-[600px]"
              onContextMenu={(e) => e.preventDefault()}
            />
            
            {/* Overlay to prevent right-click */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 1 }}
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="flex justify-center items-center p-4 select-none">
            <div className="relative">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                style={{ 
                  pointerEvents: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
                onError={(e) => {
                  console.error('Failed to load image:', fileUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              {/* Invisible overlay to prevent any interaction */}
              <div 
                className="absolute inset-0 cursor-default"
                style={{ userSelect: 'none' }}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="p-4">
            <iframe
              src={fileUrl}
              className="w-full h-[500px] border rounded"
              title={fileName}
              frameBorder="0"
              sandbox="allow-same-origin"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        );
      
      case 'document':
      case 'spreadsheet':
      case 'presentation':
        return (
          <div className="p-4 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Preview not available</h3>
              <p className="text-gray-600 mb-4">
                This file type requires an external application to view properly.
              </p>
              <p className="text-sm text-gray-500">
                File: {fileName}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                To view this {fileCategory} file, you can:
              </p>
              <ul className="list-disc list-inside text-left mt-2 text-gray-600">
                <li>Use Google Docs/Sheets/Slides (online)</li>
                <li>Microsoft Office applications</li>
                <li>LibreOffice (free alternative)</li>
                <li>Other compatible applications</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-center">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Preview not available</h3>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed in the browser.
              </p>
              <p className="text-sm text-gray-500">
                File: {fileName}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold truncate pr-4">
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-mono">
                {fileType.toUpperCase()}
              </span>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          className="overflow-auto max-h-[calc(95vh-140px)] select-none"
          style={{ userSelect: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {renderFileContent()}
        </div>

        {/* Footer with file info and security notice */}
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <p>Viewing: {fileName} • Type: {fileType}</p>
            <p className="text-xs text-gray-500">🔒 Download disabled for security</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewerModal;
