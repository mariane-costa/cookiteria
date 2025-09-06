document.addEventListener('DOMContentLoaded', () => {
    // A função updateCartCount() está em shared.js
    updateCartCount();

    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYearElement = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const schedulingForm = document.getElementById('scheduling-form');
    const deliveryLocationSelect = document.getElementById('delivery-location');

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = null;
    let selectedLocation = null;

    // Define os dias da semana para o calendário
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // Função para renderizar o calendário
    function renderCalendar() {
        // Limpa apenas os dias, mantendo os cabeçalhos
        while (calendarGrid.children.length > 7) {
            calendarGrid.removeChild(calendarGrid.lastChild);
        }

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstAvailableDate = new Date(today);
        firstAvailableDate.setDate(today.getDate() + 4); // Pedido + 3 dias de produção

        currentMonthYearElement.textContent = new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });

        // Adiciona células vazias para os dias antes do primeiro dia do mês
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-cell', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Adiciona as células dos dias do mês
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const dateString = date.toISOString().split('T')[0];
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');
            cell.textContent = i;

            if (date.getTime() < firstAvailableDate.getTime() || unavailableDates.includes(dateString)) {
                cell.classList.add('unavailable');
            } else {
                cell.classList.add('available');
                cell.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-cell.selected').forEach(cell => {
                        cell.classList.remove('selected');
                    });
                    cell.classList.add('selected');
                    selectedDate = date;
                    selectedDateDisplay.textContent = selectedDate.toLocaleDateString('pt-BR');
                });
            }

            if (selectedDate && dateString === selectedDate.toISOString().split('T')[0]) {
                cell.classList.add('selected');
            }

            calendarGrid.appendChild(cell);
        }
    }

    // Navegação do calendário
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Envio do formulário
    schedulingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const cart = loadCart();
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione produtos antes de agendar.');
            window.location.href = 'index.html';
            return;
        }

        if (!selectedDate) {
            alert('Por favor, selecione uma data de entrega.');
            return;
        }

        if (deliveryLocationSelect.value === "") {
            alert('Por favor, selecione um local de entrega.');
            return;
        }

        selectedLocation = deliveryLocationSelect.value;
        sendWhatsAppOrder(cart, selectedDate, selectedLocation);
    });

    // Função para enviar o pedido via WhatsApp, agora com agendamento
    function sendWhatsAppOrder(cart, date, location) {
        let message = `Olá, gostaria de fazer um pedido!\n\n*Detalhes do pedido:*\n\n`;
        let total = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const price = parseFloat(product.price.replace('R$', '').replace(',', '.'));
                const itemTotal = price * item.quantity;
                total += itemTotal;
                message += `${item.quantity}x ${product.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
            }
        });

        message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
        message += `*Data de Entrega:* ${date.toLocaleDateString('pt-BR')}\n`;
        message += `*Local de Entrega:* ${location}\n\n`;
        message += `**Lembrete:** A produção será iniciada após o pagamento de 50% do valor total. Entrarei em contato para combinar os detalhes. Obrigado!`;

        const encodedMessage = encodeURIComponent(message);
        // O número do WhatsApp agora está em data.js, tornando-o mais fácil de gerenciar
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    }

    renderCalendar();
});