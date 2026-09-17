import {
    useEffect,
    useRef,
    useState,
} from "react";

import axiosClient from "../utils/axiosClient";

type Message = {
    id?: string;
    role: "user" | "assistant" | "tool";
    content: string | unknown;
};

type Conversation = {
    id: string;
    title: string | null;
    createdAt: string;
    updatedAt: string;
};

const ChatHome = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] =
        useState<string | null>(null);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingConversations, setLoadingConversations] =
        useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [darkMode, setDarkMode] = useState(true);
    const [error, setError] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // =========================================================
    // Load conversations
    // =========================================================

    const loadConversations = async () => {
        try {
            setLoadingConversations(true);
            setError("");

            const response = await axiosClient.get(
                "/conversations"
            );

            setConversations(
                response.data.conversations
            );
        } catch (error) {
            console.error(
                "Failed to load conversations:",
                error
            );

            setError(
                "Failed to load conversations."
            );
        } finally {
            setLoadingConversations(false);
        }
    };

    // =========================================================
    // Load messages
    // =========================================================

    const loadMessages = async (
        conversationId: string
    ) => {
        try {
            setLoadingMessages(true);
            setError("");

            const response =
                await axiosClient.get(
                    `/conversations/${conversationId}/messages`
                );

            setMessages(
                response.data.messages
            );
        } catch (error) {
            console.error(
                "Failed to load messages:",
                error
            );

            setError(
                "Failed to load conversation."
            );

            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    // =========================================================
    // Initial load
    // =========================================================

    useEffect(() => {
        loadConversations();
    }, []);

    // =========================================================
    // Select first conversation automatically
    // =========================================================

    useEffect(() => {
        if (
            conversations.length > 0 &&
            !selectedConversationId
        ) {
            setSelectedConversationId(
                conversations[0].id
            );
        }
    }, [
        conversations,
        selectedConversationId,
    ]);

    // =========================================================
    // Load selected conversation messages
    // =========================================================

    useEffect(() => {
        if (!selectedConversationId) {
            setMessages([]);
            return;
        }

        loadMessages(
            selectedConversationId
        );
    }, [selectedConversationId]);

    // =========================================================
    // Auto scroll
    // =========================================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [
        messages,
        loading,
        loadingMessages,
    ]);

    // =========================================================
    // Auto resize textarea
    // =========================================================

    useEffect(() => {
        const textarea =
            textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        textarea.style.height = `${Math.min(
            textarea.scrollHeight,
            160
        )}px`;
    }, [input]);

    // =========================================================
    // Create conversation
    // =========================================================

    const createNewConversation =
        async () => {
            if (loading) return;

            try {
                setError("");

                const response =
                    await axiosClient.post(
                        "/conversations",
                        {
                            title: "New conversation",
                        }
                    );

                const conversation =
                    response.data.conversation;

                setConversations(
                    (prev) => [
                        conversation,
                        ...prev,
                    ]
                );

                setSelectedConversationId(
                    conversation.id
                );

                setMessages([]);
                setInput("");
            } catch (error) {
                console.error(
                    "Failed to create conversation:",
                    error
                );

                setError(
                    "Failed to create conversation."
                );
            }
        };

    // =========================================================
    // Delete conversation
    // =========================================================

    const deleteConversation =
        async (
            conversationId: string
        ) => {
            if (loading) return;

            try {
                setError("");

                await axiosClient.delete(
                    `/conversations/${conversationId}`
                );

                const remaining =
                    conversations.filter(
                        (conversation) =>
                            conversation.id !==
                            conversationId
                    );

                setConversations(
                    remaining
                );

                if (
                    selectedConversationId ===
                    conversationId
                ) {
                    if (
                        remaining.length > 0
                    ) {
                        setSelectedConversationId(
                            remaining[0].id
                        );
                    } else {
                        setSelectedConversationId(
                            null
                        );
                        setMessages([]);
                    }
                }
            } catch (error) {
                console.error(
                    "Failed to delete conversation:",
                    error
                );

                setError(
                    "Failed to delete conversation."
                );
            }
        };

    // =========================================================
    // Send message
    // =========================================================

    const sendMessage = async () => {
        if (
            !input.trim() ||
            loading
        ) {
            return;
        }

        // If no conversation exists,
        // create one first.
        let conversationId =
            selectedConversationId;

        try {
            setError("");

            if (!conversationId) {
                const response =
                    await axiosClient.post(
                        "/conversations",
                        {
                            title: input
                                .trim()
                                .slice(
                                    0,
                                    50
                                ),
                        }
                    );

                const conversation =
                    response.data.conversation;

                conversationId =
                    conversation.id;

                setConversations(
                    (prev) => [
                        conversation,
                        ...prev,
                    ]
                );

                setSelectedConversationId(
                    conversation.id
                );
            }

            const userMessage =
                input.trim();

            setMessages(
                (prev) => [
                    ...(prev || []),
                    {
                        role: "user",
                        content:
                            userMessage,
                    },
                ]
            );

            setInput("");
            setLoading(true);

            const response =
                await axiosClient.post(
                    "/chat",
                    {
                        message:
                            userMessage,
                        conversationId,
                    }
                );

            setMessages(
                (prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            response.data
                                .response,
                    },
                ]
            );

            // Refresh sidebar because
            // conversation updatedAt/title
            // may have changed.
            await loadConversations();
        } catch (error) {
            console.error(
                "Chat request failed:",
                error
            );

            setMessages(
                (prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            "Something went wrong. Please try again.",
                    },
                ]
            );
        } finally {
            setLoading(false);

            setTimeout(() => {
                textareaRef.current?.focus();
            }, 0);
        }
    };

    // =========================================================
    // Enter / Shift + Enter
    // =========================================================

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            sendMessage();
        }
    };

    // =========================================================
    // Logout
    // =========================================================

    const logout = () => {
        localStorage.removeItem(
            "accessToken"
        );

        window.location.href =
            "/login";
    };

    // =========================================================
    // Current conversation
    // =========================================================

    const selectedConversation =
        conversations.find(
            (conversation) =>
                conversation.id ===
                selectedConversationId
        );

    return (
        <div
            className={
                darkMode
                    ? "min-h-screen bg-[#0a0a0a] text-white"
                    : "min-h-screen bg-[#f7f7f8] text-gray-900"
            }
        >
            <div className="flex h-screen overflow-hidden">

                {/* =====================================================
                    SIDEBAR
                ====================================================== */}

                <aside
                    className={`hidden w-[260px] shrink-0 border-r md:flex md:flex-col ${darkMode
                        ? "border-white/[0.08] bg-[#0d0d0d]"
                        : "border-gray-200 bg-white"
                        }`}
                >

                    {/* Logo */}

                    <div className="flex h-[68px] items-center border-b px-5">
                        <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/20">
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 2v4" />
                                    <path d="M12 18v4" />
                                    <path d="m4.93 4.93 2.83 2.83" />
                                    <path d="m16.24 16.24 2.83 2.83" />
                                    <path d="M2 12h4" />
                                    <path d="M18 12h4" />
                                    <path d="m4.93 19.07 2.83-2.83" />
                                    <path d="m16.24 7.76 2.83-2.83" />
                                </svg>
                            </div>

                            <div>
                                <h1 className="text-sm font-semibold">
                                    AI Agent
                                </h1>

                                <p
                                    className={`text-[11px] ${darkMode
                                        ? "text-white/40"
                                        : "text-gray-400"
                                        }`}
                                >
                                    Autonomous assistant
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* New conversation */}

                    <div className="p-3">
                        <button
                            onClick={
                                createNewConversation
                            }
                            disabled={loading}
                            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${darkMode
                                ? "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08]"
                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>

                            <span>
                                New conversation
                            </span>
                        </button>
                    </div>

                    {/* Conversations */}

                    <div className="flex-1 overflow-y-auto px-3">

                        <p
                            className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest ${darkMode
                                ? "text-white/25"
                                : "text-gray-400"
                                }`}
                        >
                            Conversations
                        </p>

                        {loadingConversations ? (
                            <div
                                className={`px-3 py-3 text-xs ${darkMode
                                    ? "text-white/30"
                                    : "text-gray-400"
                                    }`}
                            >
                                Loading...
                            </div>
                        ) : conversations.length ===
                            0 ? (
                            <div
                                className={`px-3 py-3 text-xs ${darkMode
                                    ? "text-white/30"
                                    : "text-gray-400"
                                    }`}
                            >
                                No conversations yet.
                            </div>
                        ) : (
                            <div className="space-y-1">

                                {conversations.map(
                                    (
                                        conversation
                                    ) => {
                                        const active =
                                            conversation.id ===
                                            selectedConversationId;

                                        return (
                                            <div
                                                key={
                                                    conversation.id
                                                }
                                                className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 transition ${active
                                                    ? darkMode
                                                        ? "bg-white/[0.06]"
                                                        : "bg-gray-100"
                                                    : darkMode
                                                        ? "hover:bg-white/[0.04]"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                            >

                                                <button
                                                    onClick={() =>
                                                        setSelectedConversationId(
                                                            conversation.id
                                                        )
                                                    }
                                                    className="min-w-0 flex-1 text-left"
                                                >
                                                    <p className="truncate text-sm">
                                                        {conversation.title ||
                                                            "New conversation"}
                                                    </p>
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteConversation(
                                                            conversation.id
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                    className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs transition group-hover:flex ${darkMode
                                                        ? "text-white/30 hover:bg-red-500/10 hover:text-red-400"
                                                        : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                        }`}
                                                    title="Delete"
                                                >
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4h8v2" />
                                                        <path d="M19 6l-1 14H6L5 6" />
                                                        <path d="M10 11v5" />
                                                        <path d="M14 11v5" />
                                                    </svg>
                                                </button>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                    {/* Bottom */}

                    <div
                        className={`border-t p-3 ${darkMode
                            ? "border-white/[0.08]"
                            : "border-gray-200"
                            }`}
                    >

                        {/* Theme */}

                        <button
                            onClick={() =>
                                setDarkMode(
                                    (prev) =>
                                        !prev
                                )
                            }
                            className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${darkMode
                                ? "hover:bg-white/[0.05]"
                                : "hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-base">
                                    {darkMode
                                        ? "☾"
                                        : "☀"}
                                </span>

                                <span>
                                    {darkMode
                                        ? "Dark mode"
                                        : "Light mode"}
                                </span>
                            </div>

                            <div
                                className={`h-5 w-9 rounded-full p-0.5 transition ${darkMode
                                    ? "bg-indigo-600"
                                    : "bg-gray-300"
                                    }`}
                            >
                                <div
                                    className={`h-4 w-4 rounded-full bg-white transition-transform ${darkMode
                                        ? "translate-x-4"
                                        : "translate-x-0"
                                        }`}
                                />
                            </div>
                        </button>

                        {/* Logout */}

                        <button
                            onClick={logout}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${darkMode
                                ? "text-white/50 hover:bg-white/[0.05] hover:text-white"
                                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                            </svg>

                            <span>
                                Logout
                            </span>
                        </button>

                    </div>

                </aside>

                {/* =====================================================
                    MAIN
                ====================================================== */}

                <main className="flex min-w-0 flex-1 flex-col">

                    {/* Header */}

                    <header
                        className={`flex h-[68px] shrink-0 items-center justify-between border-b px-4 sm:px-6 ${darkMode
                            ? "border-white/[0.08] bg-[#0a0a0a]/90"
                            : "border-gray-200 bg-white/90"
                            } backdrop-blur-xl`}
                    >

                        <div className="flex items-center gap-3">

                            {/* Mobile logo */}

                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 md:hidden">
                                <span className="text-sm font-bold text-white">
                                    AI
                                </span>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold">
                                    {selectedConversation?.title ||
                                        "AI Agent"}
                                </h2>

                                <div className="mt-0.5 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                    <span
                                        className={`text-[11px] ${darkMode
                                            ? "text-white/40"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        Ready to help
                                    </span>
                                </div>
                            </div>

                        </div>

                        <div className="flex items-center gap-2">

                            {/* Mobile theme */}

                            <button
                                onClick={() =>
                                    setDarkMode(
                                        (prev) =>
                                            !prev
                                    )
                                }
                                className={`flex h-9 w-9 items-center justify-center rounded-lg transition md:hidden ${darkMode
                                    ? "hover:bg-white/[0.06]"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {darkMode
                                    ? "☀"
                                    : "☾"}
                            </button>

                            {/* Delete current */}

                            {selectedConversationId && (
                                <button
                                    onClick={() =>
                                        deleteConversation(
                                            selectedConversationId
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    className={`hidden rounded-lg px-3 py-2 text-xs transition sm:block ${darkMode
                                        ? "text-white/40 hover:bg-white/[0.05] hover:text-red-400"
                                        : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                        }`}
                                >
                                    Delete
                                </button>
                            )}

                        </div>

                    </header>

                    {/* Error */}

                    {error && (
                        <div className="border-b border-red-500/10 bg-red-500/[0.04] px-4 py-2 text-center text-xs text-red-400">
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        CHAT
                    ================================================== */}

                    <section className="relative flex-1 overflow-y-auto">

                        <div className="mx-auto min-h-full w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">

                            {/* Loading messages */}

                            {loadingMessages && (
                                <div className="flex min-h-[60vh] items-center justify-center">
                                    <div
                                        className={`text-xs ${darkMode
                                            ? "text-white/30"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        Loading conversation...
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}

                            {!loadingMessages &&
                                messages?.length ===
                                0 && (
                                    <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">

                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-indigo-500/20">
                                            <svg
                                                width="30"
                                                height="30"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M12 3v3" />
                                                <path d="M12 18v3" />
                                                <path d="M3 12h3" />
                                                <path d="M18 12h3" />
                                                <path d="m5.64 5.64 2.12 2.12" />
                                                <path d="m16.24 16.24 2.12 2.12" />
                                                <path d="m5.64 18.36 2.12-2.12" />
                                                <path d="m16.24 7.76 2.12-2.12" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        </div>

                                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                            What can I help you with?
                                        </h2>

                                        <p
                                            className={`mt-3 max-w-md text-sm leading-6 ${darkMode
                                                ? "text-white/40"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            I can reason through
                                            tasks, use connected
                                            tools, and work with
                                            your Google Sheets.
                                        </p>

                                        <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">

                                            {[
                                                "Create a Google Sheet",
                                                "Read my spreadsheet data",
                                                "Update spreadsheet records",
                                                "Add data to my sheet",
                                            ].map(
                                                (
                                                    suggestion
                                                ) => (
                                                    <button
                                                        key={
                                                            suggestion
                                                        }
                                                        onClick={() =>
                                                            setInput(
                                                                suggestion
                                                            )
                                                        }
                                                        className={`rounded-xl border p-3 text-left text-xs transition ${darkMode
                                                            ? "border-white/[0.08] bg-white/[0.025] text-white/60 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-white"
                                                            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                                                            }`}
                                                    >
                                                        {
                                                            suggestion
                                                        }
                                                    </button>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}

                            {/* Messages */}

                            {!loadingMessages && (
                                <div className="space-y-8">

                                    {messages?.map(
                                        (
                                            message,
                                            index
                                        ) => {
                                            const isUser =
                                                message.role ===
                                                "user";

                                            return (
                                                <div
                                                    key={
                                                        message.id ||
                                                        index
                                                    }
                                                    className={`flex gap-3 sm:gap-4 ${isUser
                                                        ? "justify-end"
                                                        : "justify-start"
                                                        }`}
                                                >

                                                    {!isUser && (
                                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-indigo-500/10">
                                                            <span className="text-[10px] font-bold text-white">
                                                                AI
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`max-w-[85%] sm:max-w-[75%] ${isUser
                                                            ? "order-first"
                                                            : ""
                                                            }`}
                                                    >

                                                        <div
                                                            className={`whitespace-pre-wrap break-words text-sm leading-7 ${isUser
                                                                ? darkMode
                                                                    ? "rounded-2xl rounded-br-md bg-white/[0.05] px-4 py-3 text-white/70"
                                                                    : "rounded-2xl rounded-br-md bg-gray-900 px-4 py-3 text-white"
                                                                : darkMode
                                                                    ? "text-white/85"
                                                                    : "text-gray-700"
                                                                }`}
                                                        >
                                                            {typeof message.content ===
                                                                "string"
                                                                ? message.content
                                                                : JSON.stringify(
                                                                    message.content
                                                                )}
                                                        </div>

                                                        <p
                                                            className={`mt-1.5 px-1 text-[10px] ${darkMode
                                                                ? "text-white/20"
                                                                : "text-gray-400"
                                                                }`}
                                                        >
                                                            {isUser
                                                                ? "You"
                                                                : "AI Agent"}
                                                        </p>

                                                    </div>

                                                    {isUser && (
                                                        <div
                                                            className={`mt-1 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold sm:flex ${darkMode
                                                                ? "bg-white/[0.08] text-white/60"
                                                                : "bg-gray-200 text-gray-600"
                                                                }`}
                                                        >
                                                            U
                                                        </div>
                                                    )}

                                                </div>
                                            );
                                        }
                                    )}

                                    {/* Typing */}

                                    {loading && (
                                        <div className="flex gap-3 sm:gap-4">

                                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                                                <span className="text-[10px] font-bold text-white">
                                                    AI
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 pt-2">

                                                <span
                                                    className={`h-1.5 w-1.5 animate-bounce rounded-full ${darkMode
                                                        ? "bg-white/40"
                                                        : "bg-gray-400"
                                                        }`}
                                                />

                                                <span
                                                    className={`h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:150ms] ${darkMode
                                                        ? "bg-white/40"
                                                        : "bg-gray-400"
                                                        }`}
                                                />

                                                <span
                                                    className={`h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:300ms] ${darkMode
                                                        ? "bg-white/40"
                                                        : "bg-gray-400"
                                                        }`}
                                                />

                                            </div>

                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />

                                </div>
                            )}

                        </div>

                    </section>

                    {/* =================================================
                        INPUT
                    ================================================== */}

                    <footer
                        className={`shrink-0 px-4 pb-4 pt-2 sm:px-6 sm:pb-6 ${darkMode
                            ? "bg-[#0a0a0a]"
                            : "bg-[#f7f7f8]"
                            }`}
                    >

                        <div className="mx-auto max-w-3xl">

                            <div
                                className={`relative rounded-2xl border p-2 shadow-2xl transition focus-within:border-indigo-500/50 ${darkMode
                                    ? "border-white/[0.1] bg-[#141414] shadow-black/30"
                                    : "border-gray-200 bg-white shadow-gray-200/50"
                                    }`}
                            >

                                <textarea
                                    ref={
                                        textareaRef
                                    }
                                    value={input}
                                    onChange={(
                                        e
                                    ) =>
                                        setInput(
                                            e.target
                                                .value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={
                                        loading ||
                                        loadingMessages
                                    }
                                    rows={1}
                                    placeholder="Message your AI agent..."
                                    className={`max-h-40 min-h-[48px] w-full resize-none bg-transparent px-3 py-3 pr-14 text-sm outline-none ${darkMode
                                        ? "text-white placeholder:text-white/25"
                                        : "text-gray-900 placeholder:text-gray-400"
                                        }`}
                                />

                                <button
                                    onClick={
                                        sendMessage
                                    }
                                    disabled={
                                        !input.trim() ||
                                        loading ||
                                        loadingMessages
                                    }
                                    className={`absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl transition ${input.trim() &&
                                        !loading
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
                                        : darkMode
                                            ? "bg-white/[0.06] text-white/20"
                                            : "bg-gray-100 text-gray-300"
                                        }`}
                                >
                                    <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m5 12 14-7-4 14-3-6-7-1Z" />
                                        <path d="m12 13 3-4" />
                                    </svg>
                                </button>

                            </div>

                            <p
                                className={`mt-2 text-center text-[10px] ${darkMode
                                    ? "text-white/20"
                                    : "text-gray-400"
                                    }`}
                            >
                                AI Agent can make mistakes.
                                Verify important information.
                                <span className="mx-1.5">
                                    •
                                </span>
                                Enter to send
                                <span className="mx-1.5">
                                    •
                                </span>
                                Shift + Enter for new line
                            </p>

                        </div>

                    </footer>

                </main>

            </div>
        </div>
    );
};

export default ChatHome;