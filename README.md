# E-Commerce Frontend

A modern e-commerce frontend application built with React and Vite.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArnabBiswas123/ECommerceFrontend.git
   cd ECommerceFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add the following variables:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/
   VITE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🛠️ Built With

- **React** - Frontend library
- **Vite** - Build tool and development server
- **JavaScript/TypeScript** - Programming language
- Modern CSS for styling

## 🔧 Environment Variables

This project uses the following environment variables

- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:5000/)
- `VITE_PUBLISHABLE_KEY` - Your Stripe publishable key for payment processing

**Note**: Make sure to create a `.env` file with these variables before running the application.

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## 🔗 Backend Integration

This frontend connects to a backend API running on `http://localhost:5000/`. Make sure your backend server is running before starting the frontend application.

## 💳 Payment Integration

This project includes Stripe payment integration. Replace `your_stripe_publishable_key_here` with your actual Stripe publishable key for client-side operations.d for client-side Stripe operations.

## 📝 Development Notes

- This project uses Vite for fast development and building
- Environment variables in Vite must be prefixed with `VITE_`
- Hot Module Replacement (HMR) is enabled for faster development

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Arnab Biswas**
- GitHub: [@ArnabBiswas123](https://github.com/ArnabBiswas123)

---

**Happy coding!** 🎉
