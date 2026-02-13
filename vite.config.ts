import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

function cleanPublicDir() {
  return {
    name: 'clean-public-dir',
    buildStart() {
      const publicDir = join(process.cwd(), 'public');
      try {
        const files = readdirSync(publicDir);
        files.forEach((file) => {
          if (file.includes(' ')) {
            try {
              unlinkSync(join(publicDir, file));
            } catch {
            }
          }
        });
      } catch {
      }
    },
  };
}

export default defineConfig({
  plugins: [cleanPublicDir(), react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
