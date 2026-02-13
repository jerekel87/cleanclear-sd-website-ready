// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { readdirSync, unlinkSync } from "fs";
import { join } from "path";
function cleanPublicDir() {
  return {
    name: "clean-public-dir",
    buildStart() {
      const publicDir = join(process.cwd(), "public");
      try {
        const files = readdirSync(publicDir);
        files.forEach((file) => {
          if (file.includes(" ")) {
            try {
              unlinkSync(join(publicDir, file));
            } catch {
            }
          }
        });
      } catch {
      }
    }
  };
}
var vite_config_default = defineConfig({
  plugins: [cleanPublicDir(), react()],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZWFkZGlyU3luYywgdW5saW5rU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gY2xlYW5QdWJsaWNEaXIoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2NsZWFuLXB1YmxpYy1kaXInLFxuICAgIGJ1aWxkU3RhcnQoKSB7XG4gICAgICBjb25zdCBwdWJsaWNEaXIgPSBqb2luKHByb2Nlc3MuY3dkKCksICdwdWJsaWMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gcmVhZGRpclN5bmMocHVibGljRGlyKTtcbiAgICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgIGlmIChmaWxlLmluY2x1ZGVzKCcgJykpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHVubGlua1N5bmMoam9pbihwdWJsaWNEaXIsIGZpbGUpKTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbY2xlYW5QdWJsaWNEaXIoKSwgcmVhY3QoKV0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsYUFBYSxrQkFBa0I7QUFDeEMsU0FBUyxZQUFZO0FBRXJCLFNBQVMsaUJBQWlCO0FBQ3hCLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGFBQWE7QUFDWCxZQUFNLFlBQVksS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQzlDLFVBQUk7QUFDRixjQUFNLFFBQVEsWUFBWSxTQUFTO0FBQ25DLGNBQU0sUUFBUSxDQUFDLFNBQVM7QUFDdEIsY0FBSSxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQ3RCLGdCQUFJO0FBQ0YseUJBQVcsS0FBSyxXQUFXLElBQUksQ0FBQztBQUFBLFlBQ2xDLFFBQVE7QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0gsUUFBUTtBQUFBLE1BQ1I7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUM7QUFBQSxFQUNuQyxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
