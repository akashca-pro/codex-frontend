import React from 'react';
// Import the component and necessary types/enums
import Picker, {
  type EmojiClickData,
  Theme,
  SkinTonePickerLocation
} from 'emoji-picker-react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
  };

  // Recreate the absolute positioning style
  const pickerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: 0,
    zIndex: 100,
  };

  return (
    <div style={pickerStyle}>
      <Picker
        onEmojiClick={handleEmojiClick}
        theme={Theme.DARK}
        previewConfig={{ showPreview: true }}
        skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
        width={300} 
        height={350} 
      />
    </div>
  );
};

export default EmojiPicker;