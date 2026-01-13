import AuthLogo from "./AuthLogo";

export default function RegisterImagePanel() {
  return (
    <aside
      className="hidden md:flex md:w-1/2 relative flex-col justify-between p-12 text-white bg-cover bg-center"
      style={{
        backgroundImage:
          "  url('https://lh3.googleusercontent.com/aida-public/AB6AXuAIhmeVJkxbS9Hlw1U9MxT7m0ifFPxtfAvDfsO6q6BOiHmRE8ByPaAeRYb00PyFKf1qLVb5XNembjAb2e2cNYxE6wg12BeUsg2URYq_svlFS21LIw-6HHjCItkCJij4mZVv2dvScEuDM-Y49WBmg_xRow7TxZ0gaKQczib8bKacu08NNqXrzfRzgcMRxL_s5VCZZiMtHvoHa0YPq2F2SzNQJEd8zZ7kACfjfizYnwUM6_aF_tdFrLUpWUzVxqZHM-gpPznyy6gTAek')",
      }}
    >
      <div></div>
      {/* <AuthLogo dark /> */}

      <div className="max-w-md absolute bottom-10 left-10 right-10 text-white p-6 backdrop-blur-sm bg-black/10 rounded-2xl border border-white/10">
        <h2 className="text-4xl font-bold leading-tight mb-4">
          Find your perfect space in Sri Lanka.
        </h2>
        <p className="text-lg text-gray-200">
          Whether you&apos;re looking for a cozy annex in Colombo or renting out your
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
