"use client"
const Footer=()=>{
    const currentYear = new Date().getFullYear();

    return <div>
        <footer className="bg-black py-6 px-4 md:px-6 border-t border-gray-800">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-200">&copy; {currentYear} Tech Rehub. All rights reserved.</p>
          <nav className="flex gap-4 mt-4 md:mt-0">
            <a className="text-sm text-gray-200 hover:text-white" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-gray-200 hover:text-white" href="#">
              Privacy Policy
            </a>
             Website designed by <a href="mailto:wjose@tehrehub.co.zw" className="text-blue-500 hover:underline">William Jose</a>
          </nav>
      
        </div>
      </footer>

    </div>
}

export default Footer