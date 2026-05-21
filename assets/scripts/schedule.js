(() => {
    const PRETALX_SCHEDULE_URL = "https://talks.python.org.br/caipyra-2026/schedule/";
    const LOCAL_TALK_BASE_URL = "./caipyra-2026/caipyra-2026/talk/";
    const SESSION_DETAILS = window.CAIPYRA_SCHEDULE_SESSION_DETAILS ?? {};
    const KEYNOTE_SPEAKERS = {
        Kiko: 'Christian "Kiko" Reis',
        Andressa: "Andressa Freires",
        Moacir: "Moacir Antonelli Ponti",
        Krissia: "Krissia de Zawadzki"
    };
    const WEEKDAYS = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ];

    function createElement(tagName, className, textContent) {
        const element = document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (typeof textContent === "string") {
            element.textContent = textContent;
        }

        return element;
    }

    function formatDateLabel(dateString) {
        const date = new Date(`${dateString}T12:00:00-03:00`);
        const weekday = WEEKDAYS[date.getDay()];
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");

        return `${weekday} — ${day}/${month}`;
    }

    function formatDuration(duration) {
        if (!duration) {
            return "";
        }

        const [hours, minutes] = duration.split(":").map(Number);

        if (!hours && !minutes) {
            return "";
        }

        if (!hours) {
            return `${minutes} min`;
        }

        if (!minutes) {
            return `${hours}h`;
        }

        return `${hours}h${String(minutes).padStart(2, "0")}`;
    }

    function formatActivityCount(count) {
        return `${count} ${count === 1 ? "atividade" : "atividades"}`;
    }

    function getSessionsByDay(day) {
        return Object.entries(day.rooms ?? {})
            .flatMap(([roomName, sessions]) => sessions.map((session) => ({ ...session, roomName })))
            .sort((left, right) => {
                if (left.start !== right.start) {
                    return left.start.localeCompare(right.start);
                }

                if (left.roomName !== right.roomName) {
                    return left.roomName.localeCompare(right.roomName);
                }

                return left.title.localeCompare(right.title);
            });
    }

    function createBadge(text) {
        return createElement("span", "schedule__badge", text);
    }

    function getSessionCode(session) {
        return session.url?.match(/\/talk\/([^/]+)\//)?.[1] ?? null;
    }

    function getSessionDetails(session) {
        const code = getSessionCode(session);
        const inlineDetails = {
            abstract: session.abstract ?? "",
            prerequisite: session.prerequisite ?? "",
            description: session.description ?? ""
        };
        const mappedDetails = code ? SESSION_DETAILS[code] ?? null : null;

        if (!mappedDetails && !inlineDetails.abstract && !inlineDetails.prerequisite && !inlineDetails.description) {
            return null;
        }

        return {
            ...inlineDetails,
            ...mappedDetails
        };
    }

    function getSessionPageHref(session) {
        const code = getSessionCode(session);

        if (code) {
            return `${LOCAL_TALK_BASE_URL}${code}/`;
        }

        return PRETALX_SCHEDULE_URL;
    }

    function appendSessionMeta(container, session) {
        if (session.slotType === "break") {
            container.append(createBadge("Bloco comum"));
        }

        if (session.track) {
            container.append(createBadge(session.track));
        }

        if (session.type) {
            container.append(createBadge(session.type));
        }

        if (session.duration) {
            container.append(createBadge(formatDuration(session.duration)));
        }

        if (session.endBadge) {
            container.append(createBadge(session.endBadge));
        }
    }

    function appendDetailSection(container, label, text) {
        if (!text) {
            return;
        }

        const section = createElement("section", "schedule__detail-section");
        const title = createElement("h4", "schedule__detail-label", label);
        const copy = createElement("div", "schedule__detail-copy", normalizeDetailText(text));

        section.append(title, copy);
        container.append(section);
    }

    function normalizeDetailText(text) {
        return text
            .replace(/([.!?…])([A-ZÀ-Ý])/g, "$1 $2")
            .replace(/([a-zà-ÿ])\n- /g, "$1\n- ");
    }

    function normalizeSchedule(days) {
        return days.map((day) => {
            const rooms = Object.fromEntries(
                Object.entries(day.rooms ?? {}).map(([roomName, sessions]) => [
                    roomName,
                    sessions.map((session) => {
                        const keynoteSpeaker = KEYNOTE_SPEAKERS[session.title];

                        if (!keynoteSpeaker) {
                            return session;
                        }

                        return {
                            ...session,
                            type: "Keynote",
                            persons: [keynoteSpeaker]
                        };
                    })
                ])
            );

            if (day.date !== "2026-06-04") {
                return { ...day, rooms };
            }

            return {
                ...day,
                rooms: {
                    "Atividades do dia": [
                        {
                            start: "08:30",
                            end: "18:00",
                            duration: null,
                            title: "Curso Python Introdutório",
                            url: null,
                            track: null,
                            type: "Curso",
                            persons: ["PyLadies São Carlos"],
                            slotType: "session",
                            endBadge: "Termina às 18h",
                            abstract: "Curso Python Introdutório ministrado por PyLadies São Carlos, com início às 8h30.",
                            description: "Atividade de quinta-feira, das 8h30 às 18h, com introdução à linguagem Python e acompanhamento do PyLadies São Carlos.",
                            prerequisite: ""
                        },
                        {
                            start: "09:00",
                            end: "18:00",
                            duration: null,
                            title: "Sprints em projetos open source",
                            url: null,
                            track: null,
                            type: "Sprints",
                            persons: [],
                            slotType: "session",
                            endBadge: "Termina às 18h",
                            abstract: "Dia dedicado a sprints em projetos open source da comunidade, com início às 9h.",
                            description: "Atividade de quinta-feira, das 9h às 18h, voltada à colaboração em projetos open source, troca de conhecimento e contribuição coletiva.",
                            prerequisite: ""
                        }
                    ]
                }
            };
        });
    }

    function createSessionSummary(session, speakers) {
        const summary = createElement("summary", "schedule__session-summary");
        const topRow = createElement("div", "schedule__session-summary-top");
        const title = createElement("span", "schedule__session-title schedule__session-title--static", session.title);
        const toggle = createElement("span", "schedule__session-toggle");
        const meta = createElement("div", "schedule__meta");

        topRow.append(title, toggle);
        summary.append(topRow);

        if (speakers) {
            summary.append(createElement("p", "schedule__session-speakers", speakers));
        }

        appendSessionMeta(meta, session);

        if (meta.childElementCount > 0) {
            summary.append(meta);
        }

        return summary;
    }

    function createStaticSession(session, speakers) {
        const wrapper = createElement(
            "div",
            session.slotType === "break" ? "schedule__session schedule__session--break" : "schedule__session"
        );
        const title = createElement("span", "schedule__session-title schedule__session-title--static", session.title);
        const meta = createElement("div", "schedule__meta");

        wrapper.append(title);

        if (speakers) {
            wrapper.append(createElement("p", "schedule__session-speakers", speakers));
        }

        appendSessionMeta(meta, session);

        if (meta.childElementCount > 0) {
            wrapper.append(meta);
        }

        return wrapper;
    }

    function createInteractiveSession(session, speakers, details) {
        const disclosure = createElement("details", "schedule__session schedule__session--interactive");
        const body = createElement("div", "schedule__session-body");
        const hasDetailContent = Boolean(details?.abstract || details?.prerequisite || details?.description);

        disclosure.append(createSessionSummary(session, speakers));

        appendDetailSection(body, "Resumo", details?.abstract);
        appendDetailSection(body, "Conhecimento prévio necessário", details?.prerequisite);
        appendDetailSection(body, "Descrição", details?.description);

        if (!hasDetailContent) {
            body.append(createElement(
                "p",
                "schedule__detail-copy",
                "Mais detalhes estarão disponíveis na página completa da sessão."
            ));
        }

        if (session.url) {
            const actions = createElement("div", "schedule__session-actions");
            const sessionLink = createElement("a", "schedule__session-link", "Abrir página completa da sessão");

            sessionLink.href = getSessionPageHref(session);
            sessionLink.target = "_blank";
            sessionLink.rel = "noopener";
            actions.append(sessionLink);
            body.append(actions);
        }

        disclosure.append(body);

        return disclosure;
    }

    function createSessionCell(session) {
        const cell = createElement("td");
        const speakers = session.persons?.map((person) => typeof person === "string" ? person : person.public_name).join(", ");
        const details = getSessionDetails(session);

        if (session.slotType === "break") {
            cell.append(createStaticSession(session, speakers));
            return cell;
        }

        cell.append(createInteractiveSession(session, speakers, details));
        return cell;
    }

    function createTable(day, sessions) {
        const table = createElement("table", "schedule__table schedule__table--detailed");
        const caption = createElement("caption", "sr-only", `Programação de ${formatDateLabel(day.date)}`);
        const thead = createElement("thead");
        const headerRow = createElement("tr");
        const tbody = createElement("tbody");

        [
            "Horário",
            "Sala",
            "Sessão"
        ].forEach((heading) => {
            const headerCell = createElement("th", null, heading);
            headerCell.scope = "col";
            headerRow.append(headerCell);
        });

        thead.append(headerRow);
        table.append(caption, thead, tbody);

        sessions.forEach((session) => {
            const row = createElement("tr");
            const timeCell = createElement("th", null, session.start);
            const roomCell = createElement("td", "schedule__room", session.roomName);
            const sessionCell = createSessionCell(session);

            timeCell.scope = "row";
            timeCell.dataset.label = "Horário";
            roomCell.dataset.label = "Sala";
            sessionCell.dataset.label = "Sessão";

            row.append(timeCell, roomCell, sessionCell);
            tbody.append(row);
        });

        return table;
    }

    function createDayCard(day) {
        const item = createElement("li", "item-card");
        const disclosure = createElement("details", "schedule__day");
        const summary = createElement("summary", "item-card__header schedule__day-summary");
        const heading = createElement("div", "schedule__day-heading");
        const title = createElement("h3", null, formatDateLabel(day.date));
        const count = createElement("span", "schedule__day-count", formatActivityCount(getSessionsByDay(day).length));
        const toggle = createElement("span", "schedule__day-toggle");
        const content = createElement("div", "item-card__content schedule__day-content");
        const sessions = getSessionsByDay(day);

        disclosure.open = true;

        heading.append(title, count);
        summary.append(heading, toggle);
        disclosure.append(summary, content);
        item.append(disclosure);

        if (sessions.length === 0) {
            content.append(createElement(
                "p",
                "schedule__empty",
                "Ainda não há sessões publicadas no pretalx para este dia."
            ));

            return item;
        }

        content.append(createTable(day, sessions));
        return item;
    }

    function renderError(scheduleRoot, scheduleStatus, message) {
        const item = createElement("li", "item-card");
        const header = createElement("div", "item-card__header");
        const title = createElement("h3", null, "Programação indisponível");
        const content = createElement("div", "item-card__content");
        const text = createElement("p", "schedule__empty", message);
        const link = createElement("a", "schedule__more-link", "Abrir agenda no pretalx");

        link.href = PRETALX_SCHEDULE_URL;
        link.target = "_blank";
        link.rel = "noopener";

        header.append(title);
        content.append(text, link);
        item.append(header, content);

        scheduleRoot.replaceChildren(item);
        scheduleStatus.textContent = "Não foi possível carregar a programação local. A agenda completa segue disponível no pretalx.";
    }

    function renderSchedule(days, scheduleRoot, scheduleStatus) {
        const fragment = document.createDocumentFragment();

        days.forEach((day) => {
            fragment.append(createDayCard(day));
        });

        scheduleRoot.replaceChildren(fragment);
        scheduleStatus.textContent = "Programação baseada na exportação oficial do pretalx e complementada com informações da organização.";
    }

    function loadSchedule(scheduleRoot, scheduleStatus) {
        const dataElement = document.getElementById("schedule-data");
        let days;

        if (!dataElement) {
            renderError(scheduleRoot, scheduleStatus, "Dados da programação não encontrados.");
            return;
        }

        try {
            days = JSON.parse(dataElement.textContent)?.days;
        } catch {
            renderError(scheduleRoot, scheduleStatus, "Não foi possível ler a programação embutida.");
            return;
        }

        if (!Array.isArray(days)) {
            renderError(scheduleRoot, scheduleStatus, "Estrutura de programação inválida.");
            return;
        }

        renderSchedule(normalizeSchedule(days), scheduleRoot, scheduleStatus);
    }

    function init() {
        const scheduleRoot = document.getElementById("schedule-content");
        const scheduleStatus = document.getElementById("schedule-status");

        if (!scheduleRoot || !scheduleStatus) {
            return;
        }

        loadSchedule(scheduleRoot, scheduleStatus);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
        return;
    }

    init();
})();
