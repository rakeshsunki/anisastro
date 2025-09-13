"use client";

import { useState } from "react";

const items = [
	{
		title: "Love",
		color: "from-rose-500 to-fuchsia-500",
		text: "Matters of the heart and relationships.",
		description: "Explore the cosmic influences on your romantic life. Discover how planetary alignments affect your relationships, emotional connections, and the potential for love in your life. Whether you're single or committed, the stars can guide you toward deeper understanding and meaningful connections.",
		icon: "💕"
	},
	{
		title: "Life",
		color: "from-emerald-500 to-teal-500",
		text: "Wellbeing, growth, and balance.",
		description: "Your life path is written in the stars. Understand how celestial bodies influence your personal growth, health, and overall wellbeing. Learn about the cycles of transformation and how to align with cosmic energies for a more balanced and fulfilling existence.",
		icon: "🌿"
	},
	{
		title: "Career",
		color: "from-indigo-500 to-cyan-500",
		text: "Your path, skills, and ambitions.",
		description: "Uncover your professional destiny through astrological insights. Discover your natural talents, ideal career paths, and the best times for making important professional decisions. Let the stars guide you toward success and fulfillment in your chosen field.",
		icon: "⭐"
	},
	{
		title: "Partner",
		color: "from-amber-500 to-orange-600",
		text: "Compatibility and connections.",
		description: "Find your cosmic match through astrological compatibility. Learn how your sign interacts with others, discover your ideal partner traits, and understand the dynamics that make relationships thrive. Explore the celestial blueprint for lasting partnerships.",
		icon: "💫"
	},
	{
		title: "Future",
		color: "from-sky-500 to-violet-600",
		text: "Possibilities and guidance ahead.",
		description: "Peer into the cosmic veil and glimpse what lies ahead. Through planetary transits and astrological forecasts, gain insights into upcoming opportunities, challenges, and transformative periods in your life. Prepare for tomorrow with celestial wisdom.",
		icon: "🔮"
	},
];

function FlipCard({ title, color, text }) {
	const [flipped, setFlipped] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	const send = (e) => {
		e.preventDefault();
		const value = input.trim();
		if (!value) return;
		setMessages((m) => [...m, { id: Date.now(), text: value }]);
		setInput("");
	};

	return (
		<div
			className="relative h-96 w-72 sm:h-[26rem] sm:w-80 md:h-[28rem] md:w-72 [perspective:1000px] focus:outline-none mx-auto"
			aria-label={`${title} card`}
		>
			<div
				className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
					flipped ? "[transform:rotateY(180deg)]" : ""
				}`}
			>
				{/* Front */}
				<div
					className={`absolute inset-0 rounded-xl overflow-hidden bg-gradient-to-br ${color} p-4 text-white shadow-lg [backface-visibility:hidden] flex items-end cursor-pointer`}
					onClick={(e) => {
						e.stopPropagation();
						setFlipped(true);
					}}
				>
					{/* Decorative astrology layers */}
					<div className="pointer-events-none absolute inset-0">
						{/* Faint radial glow */}
						<div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
						{/* Star dots - static positions */}
						<div className="absolute inset-0 mix-blend-screen opacity-70">
							{[
								{ top: '15%', left: '20%', size: 2, opacity: 0.7 },
								{ top: '25%', left: '75%', size: 1.5, opacity: 0.5 },
								{ top: '40%', left: '10%', size: 3, opacity: 0.8 },
								{ top: '60%', left: '85%', size: 2.5, opacity: 0.6 },
								{ top: '70%', left: '30%', size: 1, opacity: 0.4 },
								{ top: '35%', left: '60%', size: 2, opacity: 0.9 },
								{ top: '80%', left: '15%', size: 1.5, opacity: 0.3 },
								{ top: '10%', left: '80%', size: 2.5, opacity: 0.7 },
								{ top: '50%', left: '45%', size: 1, opacity: 0.5 },
								{ top: '20%', left: '50%', size: 3, opacity: 0.6 },
								{ top: '85%', left: '70%', size: 2, opacity: 0.8 },
								{ top: '45%', left: '25%', size: 1.5, opacity: 0.4 },
								{ top: '65%', left: '55%', size: 2.5, opacity: 0.7 },
								{ top: '30%', left: '90%', size: 1, opacity: 0.5 },
								{ top: '75%', left: '5%', size: 2, opacity: 0.6 },
								{ top: '55%', left: '35%', size: 1.5, opacity: 0.8 },
								{ top: '90%', left: '80%', size: 3, opacity: 0.4 },
								{ top: '5%', left: '65%', size: 2, opacity: 0.9 }
							].map((star, i) => (
								<span
									key={i}
									className="absolute rounded-full bg-white"
									style={{
										top: star.top,
										left: star.left,
										width: `${star.size}px`,
										height: `${star.size}px`,
										opacity: star.opacity,
										boxShadow: "0 0 6px 2px rgba(255,255,255,0.4)",
									}}
								/>
							))}
						</div>
						{/* Constellation lines (static SVG) */}
						<svg
							className="absolute inset-0 w-full h-full opacity-35"
							viewBox="0 0 300 400"
							fill="none"
							stroke="white"
							strokeWidth="1"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M40 300 L90 250 L130 260 L170 210 L210 230 L250 180" className="opacity-60" />
							<path d="M120 340 L150 300 L200 320 L230 280" className="opacity-40" />
						</svg>
						{/* Zodiac circle */}
						<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-48 md:h-48 opacity-25">
							<div className="w-full h-full rounded-full border border-white/40 animate-[spin_25s_linear_infinite]" />
							<div className="absolute inset-2 rounded-full border border-white/20" />
							{/* Cardinal points */}
							{['N','E','S','W'].map((d, i) => (
								<span
									key={d}
									className="absolute text-[10px] tracking-wider text-white/60"
									style={{
										top: '50%',
										left: '50%',
										transform: `translate(-50%,-50%) rotate(${i * 90}deg) translateY(-18.5rem) rotate(-${i * 90}deg)`
									}}
								>
									{d}
								</span>
							))}
						</div>
						{/* Subtle grain */}
						<div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'repeating-radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0 1px, transparent 1px 4px)' }} />
					</div>
					<h3 className="relative z-10 text-lg font-semibold drop-shadow-md bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
						{title}
					</h3>
				</div>
				{/* Back with chat */}
				<div 
					className="absolute inset-0 rounded-xl overflow-hidden bg-white p-3 text-gray-800 shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col"
					onClick={(e) => {
						// Only flip back if clicking outside the form area
						if (e.target === e.currentTarget) {
							setFlipped(false);
						}
					}}
				>
						<div className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
							<span>Payment Verification - {title}</span>
							<button
								onClick={() => setFlipped(false)}
								className="ml-2 text-gray-400 hover:text-gray-600 text-lg leading-none flex items-center"
								aria-label="Close chat"
								type="button"
							>
								{/* Cross (X) icon */}
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div className="mt-2 flex-1 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3 min-h-0">
							{/* Payment Pending Message */}
							<div className="text-center py-8">
								<div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
									<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h3 className="font-medium text-gray-900 mb-2">Payment Verification Pending</h3>
								<p className="text-xs text-gray-600 mb-3">
									We&apos;re verifying your ₹10 payment. You&apos;ll receive a response within 24 hours.
								</p>
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
									<p className="text-xs text-blue-800">
										<strong>Status:</strong> Payment submitted for verification<br/>
										<strong>Response time:</strong> Within 24 hours<br/>
										<strong>Refund policy:</strong> 2 days if payment not received
									</p>
								</div>
								<p className="text-xs text-gray-500">
									💡 Chat will be unlocked once payment is verified
								</p>
							</div>
						</div>
						<div className="mt-2 p-2 bg-gray-100 rounded-md text-center">
							<p className="text-xs text-gray-600">
								🔒 Chat locked until payment verification
							</p>
						</div>
				</div>
			</div>
		</div>
	);
}

export default function RegisterPage() {
	const [step, setStep] = useState(1); // 1: form, 2: category selection, 3: payment, 4: flip card
	const [form, setForm] = useState({
		name: "",
		email: "",
		dob: "",
		placeOfBirth: "",
		phone: "",
	});
	const [selectedType, setSelectedType] = useState("");
	const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, completed, failed

	const onChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({ ...f, [name]: value }));
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		
		try {
			// Create user in database
			const response = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form),
			});
			
			const result = await response.json();
			
			if (response.ok) {
				// User created successfully, move to category selection
				setStep(2);
			} else {
				// Handle error
				if (response.status === 409) {
					alert('An account with this email already exists. Please use a different email.');
				} else {
					alert(result.error || 'Failed to create account. Please try again.');
				}
			}
		} catch (error) {
			console.error('Error creating user:', error);
			alert('Failed to create account. Please check your internet connection and try again.');
		}
	};

	const handleCategorySubmit = (e) => {
		e.preventDefault();
		if (selectedType) {
			setStep(3); // Go to payment step
		}
	};

	const handlePaymentSuccess = () => {
		setPaymentStatus('completed');
		setStep(4); // Go to flip card after payment
	};

	const resetToForm = () => {
		setStep(1);
		setSelectedType("");
		setPaymentStatus('pending');
	};

	const selectedItem = items.find(item => item.title === selectedType);

	// Payment Component
	const PaymentStep = () => {
		const [paymentStep, setPaymentStep] = useState('qr'); // 'qr' or 'confirmation'
		const [userQuestion, setUserQuestion] = useState('');

		const handleQuestionSubmit = (e) => {
			e.preventDefault();
			if (userQuestion.trim()) {
				setPaymentStep('confirmation');
			}
		};

		const handlePaymentConfirmation = async () => {
			try {
				// Submit payment verification to database
				const response = await fetch('/api/payment/process', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: form.email,
						category: selectedType,
						amount: 10,
						question: userQuestion,
						paymentMethod: 'manual'
					}),
				});
				
				const result = await response.json();
				
				if (response.ok) {
					// Payment submitted successfully
					setPaymentStatus('completed');
					handlePaymentSuccess();
				} else {
					alert(result.error || 'Failed to submit payment verification. Please try again.');
				}
			} catch (error) {
				console.error('Error submitting payment:', error);
				alert('Failed to submit payment verification. Please check your connection and try again.');
			}
		};

		if (paymentStep === 'confirmation') {
			return (
				<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
					<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
						<div className="text-center mb-6">
							<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
							<p className="text-gray-600">Thank you for your question about {selectedType}</p>
						</div>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
							<h3 className="font-medium text-blue-900 mb-2">Your Question:</h3>
							<p className="text-blue-800 text-sm italic">&quot;{userQuestion}&quot;</p>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
							<div className="flex items-start gap-3">
								<svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
								<div>
									<h3 className="font-medium text-yellow-800">Payment Verification</h3>
									<p className="text-yellow-700 text-sm mt-1">
										We will verify your payment and respond within <strong>24 hours</strong>. 
										If payment is not received, amount will be refunded within <strong>2 days</strong>.
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<button
								onClick={handlePaymentConfirmation}
								className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
							>
								Continue to Chat
							</button>
							<button
								onClick={() => setPaymentStep('qr')}
								className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
							>
								Back to Payment
							</button>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
				<div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
					<div className="text-center mb-6">
						<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-2xl">{selectedItem.icon}</span>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mb-2">Ask Your Question</h2>
						<p className="text-gray-600">Ask your {selectedType.toLowerCase()} question first, then pay ₹10</p>
					</div>

					<form onSubmit={handleQuestionSubmit} className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Your {selectedType} Question:
						</label>
						<textarea
							value={userQuestion}
							onChange={(e) => setUserQuestion(e.target.value)}
							placeholder={`Ask anything about ${selectedType.toLowerCase()}...`}
							className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
							required
						/>
						<button
							type="submit"
							className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
						>
							Submit Question & Pay ₹10
						</button>
					</form>

					{userQuestion && (
						<div className="border-t pt-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Pay ₹10 via UPI</h3>
							
							{/* QR Code Placeholder */}
							<div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
								<div className="w-32 h-32 bg-white border border-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
									<div className="text-gray-400">
										<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
										</svg>
									</div>
								</div>
								<p className="text-sm text-gray-600 mb-2">UPI QR Code</p>
								<p className="text-xs text-gray-500">(Replace this with your actual QR code image)</p>
							</div>

							<div className="text-center mb-4">
								<p className="text-sm text-gray-600 mb-2">Or pay to UPI ID:</p>
								<p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded border">your-upi-id@paytm</p>
							</div>

							<div className="space-y-3">
								<button
									onClick={() => setPaymentStep('confirmation')}
									className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
								>
									I&apos;ve Paid ₹10
								</button>
								<button
									onClick={() => setStep(2)}
									className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-sm"
								>
									Back to Categories
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	};

	// Step 3: Payment
	if (step === 3 && selectedItem) {
		return <PaymentStep />;
	}

	// Step 4: Flip Card View
	if (step === 4 && selectedItem) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-x-hidden max-w-full">
				{/* Mobile Layout */}
				<div className="lg:hidden min-h-screen flex flex-col overflow-x-hidden">
					{/* Mobile Header */}
					<div className="p-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
						<div className="flex items-center justify-between">
							<button
								onClick={() => setStep(2)}
								className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
								<span className="text-sm">Back</span>
							</button>
							<div className="flex items-center gap-2">
								<span className="text-2xl">{selectedItem.icon}</span>
								<h2 className="text-xl font-bold text-white">
									{selectedItem.title}
								</h2>
							</div>
						</div>
					</div>

					{/* Mobile Description */}
					<div className="p-4 bg-white/5">
						<p className="text-sm text-indigo-200/90 leading-relaxed">
							{selectedItem.description}
						</p>
					</div>

					{/* Mobile Card Container */}
					<div className="flex-1 flex items-center justify-center p-4 pb-8">
						<div className="w-full max-w-sm">
							<FlipCard {...selectedItem} />
							<p className="mt-4 text-center text-indigo-200/80 text-sm">
								Tap the card to start chatting
							</p>
							<div className="mt-6 text-center">
								<button
									onClick={resetToForm}
									className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
								>
									Finish & Explore More
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden lg:flex h-screen items-center justify-between px-4 md:px-8 lg:px-16">
					{/* Description section - left side */}
					<div className="flex-1 max-w-md xl:max-w-lg pr-8">
						<div className="space-y-6">
							<div className="flex items-center gap-3">
								<span className="text-4xl">{selectedItem.icon}</span>
								<h2 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
									{selectedItem.title}
								</h2>
							</div>
							<p className="text-lg xl:text-xl text-indigo-200/90 leading-relaxed">
								{selectedItem.description}
							</p>
							<div className="space-y-3">
								<button
									onClick={() => setStep(2)}
									className="flex items-center gap-2 text-sm text-indigo-300 hover:text-white transition-colors"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
									</svg>
									Back to categories
								</button>
								<button
									onClick={resetToForm}
									className="block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
								>
									Finish & Explore More
								</button>
							</div>
						</div>
					</div>

					{/* Flip card display */}
					<div className="relative flex-shrink-0">
						<FlipCard {...selectedItem} />
						<p className="mt-4 text-center text-indigo-200/80 text-sm">Flip to see payment status</p>
					</div>
				</div>
			</div>
		);
	}

	// Step 2: Category Selection
	if (step === 2) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center px-4">
				<div className="w-full max-w-4xl mx-auto">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="flex items-center justify-center gap-2 mb-4">
							<button
								onClick={resetToForm}
								className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
								</svg>
							</button>
							<h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
								Welcome, {form.name}!
							</h1>
						</div>
						<p className="text-lg md:text-xl text-indigo-200/80">
							Choose an area you&apos;d like to explore through cosmic guidance
						</p>
					</div>

					<form onSubmit={handleCategorySubmit} className="space-y-8">
						{/* Category Selection */}
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{items.map((item) => (
									<label
										key={item.title}
										className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
											selectedType === item.title
												? 'border-white bg-white/10 shadow-lg scale-105 ring-2 ring-white/50'
												: 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
										}`}
									>
										<input
											type="radio"
											name="type"
											value={item.title}
											checked={selectedType === item.title}
											onChange={(e) => setSelectedType(e.target.value)}
											className="sr-only"
										/>
										<div className="text-center">
											<span className="text-3xl block mb-2">{item.icon}</span>
											<h3 className="text-lg font-semibold text-white mb-2">
												{item.title}
											</h3>
											<p className="text-sm text-indigo-200/70">
												{item.text}
											</p>
											{selectedType === item.title && (
												<div className="mt-3 flex items-center justify-center">
													<span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full animate-pulse">
														✓ Selected
													</span>
												</div>
											)}
										</div>
										{selectedType === item.title && (
											<div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-20 pointer-events-none" 
												style={{backgroundImage: `linear-gradient(to bottom right, ${item.color.replace('from-', '').replace('to-', ', ')})`}}
											/>
										)}
									</label>
								))}
							</div>
							
							{/* Helper text after selection */}
							{selectedType && (
								<div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20 animate-in slide-in-from-bottom duration-300">
									<div className="flex items-center gap-2 text-indigo-200">
										<svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
										<span className="text-sm">
											Great choice! <strong>{selectedType}</strong> is selected. Continue to explore this area.
										</span>
									</div>
								</div>
							)}
						</div>

						{/* Submit Button */}
						<div className="text-center">
							{selectedType && (
								<div className="mb-4 animate-in slide-in-from-bottom duration-500 delay-200">
									<div className="flex items-center justify-center gap-2 text-indigo-300 text-sm mb-2">
										<span className="animate-bounce">👇</span>
										<span>Continue to explore {selectedType}</span>
										<span className="animate-bounce">👇</span>
									</div>
								</div>
							)}
							
							<button
								type="submit"
								disabled={!selectedType}
								className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden ${
									selectedType
										? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse'
										: 'bg-gray-600 text-gray-300 cursor-not-allowed'
								}`}
							>
								{selectedType ? (
									<span className="flex items-center gap-2">
										<span>Explore {selectedType}</span>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</span>
								) : (
									<span className="flex items-center gap-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
										</svg>
										<span>Select a category first</span>
									</span>
								)}
								
								{selectedType && (
									<div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
								)}
							</button>
							
							{!selectedType && (
								<p className="mt-3 text-sm text-indigo-300/60">
									👆 Choose one of the categories above to continue
								</p>
							)}
						</div>
					</form>
				</div>
			</div>
		);
	}

	// Step 1: Registration Form
	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6 overflow-x-hidden max-w-full">
			{/* Background decor */}
			<div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				{/* Stars layer */}
				<div
					className="absolute inset-0 opacity-25"
					style={{
						backgroundImage: "radial-gradient(white 1px, transparent 1px)",
						backgroundSize: "3px 3px",
						backgroundPosition: "0 0",
					}}
				/>
				{/* Planets */}
				<div
					className="absolute -top-24 -left-24 h-72 w-72 rounded-full"
					style={{
						background:
							"radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(99,102,241,.6) 35%, rgba(79,70,229,.55) 55%, rgba(30,27,75,.7) 100%)",
						boxShadow: "0 30px 90px rgba(79,70,229,.35)",
					}}
				/>
				<div
					className="absolute bottom-[-6rem] right-[-6rem] h-80 w-80 rounded-full"
					style={{
						background:
							"radial-gradient(circle at 70% 30%, rgba(255,255,255,.8), rgba(20,184,166,.5) 40%, rgba(6,182,212,.55) 60%, rgba(15,118,110,.7) 100%)",
						boxShadow: "0 30px 90px rgba(6,182,212,.35)",
					}}
				/>
				<div
					className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full"
					style={{
						background:
							"radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(236,72,153,.6) 45%, rgba(147,51,234,.6) 75%)",
						boxShadow: "0 10px 40px rgba(147,51,234,.35)",
					}}
				/>
				<div
					className="absolute left-1/3 top-3/4 h-2 w-2 rounded-full bg-white/80"
					style={{ boxShadow: "0 0 10px 4px rgba(255,255,255,.6)" }}
				/>
			</div>

			<div className="w-full max-w-2xl rounded-2xl border border-gray-200/20 bg-white/10 backdrop-blur-xl shadow-xl">
				<div className="p-8 md:p-10">
					{/* Header */}
					<div className="mb-8 text-center">
						<div className="mx-auto mb-4 flex items-center justify-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
								{/* Simple star/astro icon */}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
									<path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77 7.22 16.7l.91-5.32L4.27 7.62l5.34-.78L12 2z" />
								</svg>
							</div>
							<span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
								AnisAstro
							</span>
						</div>
						<h1 className="text-2xl font-semibold text-white">Join the cosmic journey</h1>
						<p className="mt-1 text-indigo-200/80">Create your account to explore personalized astrology insights</p>
					</div>

					{/* Form */}
					<form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="md:col-span-2">
							<label htmlFor="name" className="block text-sm font-medium text-indigo-100">
								Full name
							</label>
							<div className="mt-1">
								<input
									id="name"
									name="name"
									type="text"
									required
									value={form.name}
									onChange={onChange}
									placeholder="Jane Doe"
									className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-indigo-100">
								Email
							</label>
							<div className="mt-1">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									value={form.email}
									onChange={onChange}
									placeholder="you@example.com"
									className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="dob" className="block text-sm font-medium text-indigo-100">
								Date of birth
							</label>
							<div className="mt-1">
								<input
									id="dob"
									name="dob"
									type="date"
									required
									value={form.dob}
									onChange={onChange}
									className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 [color-scheme:dark]"
								/>
							</div>
						</div>

						<div className="md:col-span-2">
							<label htmlFor="placeOfBirth" className="block text-sm font-medium text-indigo-100">
								Place of birth
							</label>
							<div className="mt-1">
								<input
									id="placeOfBirth"
									name="placeOfBirth"
									type="text"
									required
									value={form.placeOfBirth}
									onChange={onChange}
									placeholder="City, Country"
									className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
								/>
							</div>
						</div>

						<div className="md:col-span-2">
							<label htmlFor="phone" className="block text-sm font-medium text-indigo-100">
								Phone number (optional)
							</label>
							<div className="mt-1">
								<input
									id="phone"
									name="phone"
									type="tel"
									value={form.phone}
									onChange={onChange}
									placeholder="+91 12345 67890"
									className="block w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-indigo-200/60 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
								/>
							</div>
						</div>

						<div className="md:col-span-2">
							<button
								type="submit"
								className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
							>
								Continue to Astrology Exploration
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
