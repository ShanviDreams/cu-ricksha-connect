
const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="cu-container py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">© {new Date().getFullYear()} CU E-Ricksha. All rights reserved.</p>
          </div>
          <div className="text-sm">
            <p>Chandigarh University</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
