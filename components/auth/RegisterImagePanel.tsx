import AuthLogo from "./AuthLogo";

export default function RegisterImagePanel() {
  return (
    <aside
      className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(13,27,20,.4), rgba(13,27,20,.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBeT4RH7u9xQqT54nPiFbkyBoMW1Nq0nToDyHEDlQDcHsyYrTQUwQ0JVfW1-2Wt-biROVbOjR5wjh4Hd23nFEPPfOf1cWCBG_d-pkoLUfzpolDM87OL7r_LG-TihyIjiy0oPdsyqEyzqlUiKUKaUU9gwadvLZkINP-Wjn7-mPF_0PBCgsKhpdguQL39Yg6CpmW5uwHjDbjPbLfXzw0h8Q4Ey2HOmgKgnjEKR2jaxaN4sc_41wBeKRUwioZZJpRH6s0dRVwDbe7lb1w')",
      }}
    >
      <AuthLogo dark />

      <div className="max-w-md">
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Find your perfect space in Sri Lanka.
        </h2>
        <p className="text-lg text-gray-200">
          Whether you&apos;re looking for a cozy anex in Colombo or renting out your
          room in Kandy, we&apos;ve got you covered.
        </p>

        {/* Social Proof */}
        <div className="mt-8 flex gap-3 items-center">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt=""
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold">10k+ Sri Lankans</p>
            <p className="text-xs text-gray-300">joined last month</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
