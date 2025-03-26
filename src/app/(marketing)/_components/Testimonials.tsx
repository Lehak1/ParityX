import Image from "next/image";
import avatar1 from "@/assets/avatar-1.png";
import avatar2 from "@/assets/avatar-2.png";
import avatar3 from "@/assets/avatar-3.png";
import avatar4 from "@/assets/avatar-4.png";
import avatar5 from "@/assets/avatar-5.png";
import avatar6 from "@/assets/avatar-6.png";
import avatar7 from "@/assets/avatar-7.png";
import avatar8 from "@/assets/avatar-8.png";
import avatar9 from "@/assets/avatar-9.png";

const testimonials = [
  { text: "As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.", imageSrc: avatar1.src, name: "Jamie Rivera", username: "@jamietechguru00" },
  { text: "Our team's productivity has skyrocketed since we started using this tool.", imageSrc: avatar2.src, name: "Josh Smith", username: "@jjsmith" },
  { text: "This app has completely transformed how I manage my projects and deadlines.", imageSrc: avatar3.src, name: "Morgan Lee", username: "@morganleewhiz" },
  { text: "I was amazed at how quickly we were able to integrate this app into our workflow.", imageSrc: avatar4.src, name: "Casey Jordan", username: "@caseyj" },
  { text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts.", imageSrc: avatar5.src, name: "Taylor Kim", username: "@taylorkimm" },
  { text: "The customizability and integration capabilities of this app are top-notch.", imageSrc: avatar6.src, name: "Riley Smith", username: "@rileysmith1" },
  { text: "Adopting this app for our team has streamlined our project management and improved communication across the board.", imageSrc: avatar7.src, name: "Jordan Patels", username: "@jpatelsdesign" },
  { text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.", imageSrc: avatar8.src, name: "Sam Dawson", username: "@dawsontechtips" },
  { text: "Its user-friendly interface and robust features support our diverse needs.", imageSrc: avatar9.src, name: "Casey Harper", username: "@casey09" },
];

const columns = [
  testimonials.slice(0, 3),
  testimonials.slice(3, 6),
  testimonials.slice(6, 9),
];

export const Testimonials = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          
          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From intuitive design to powerful features, our app has become an
            essential tool for users worldwide.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="space-y-8">
              {column.map(({ text, imageSrc, name, username }, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg bg-white p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <p className="text-gray-700 leading-relaxed">{text}</p>
                  <div className="mt-5 flex items-center space-x-4">
                    <Image
                      src={imageSrc}
                      alt={name}
                      width={50}
                      height={50}
                      className="h-12 w-12 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{name}</div>
                      <div className="text-sm text-gray-500">{username}</div>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 transition-all duration-300 hover:h-2"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
