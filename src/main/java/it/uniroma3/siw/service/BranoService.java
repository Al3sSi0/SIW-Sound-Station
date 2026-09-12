package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.stereotype.Service;

import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.repository.BranoRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@Service
public class BranoService {
	private BranoRepository branoRepository;
	
	public BranoService(BranoRepository branoRepository) {
		this.branoRepository = branoRepository;
	}

	public List<Brano> findAll() {
		return (List<Brano>) this.branoRepository.findAll();
	}

	public Brano findById(Long id) {
		return this.branoRepository.findById(id).get();
	}

	public void save(@Valid Brano brano) {
		this.branoRepository.save(brano);		
	}
	
	@Transactional
	public void delete(Brano branoEsistente) {
		this.branoRepository.delete(branoEsistente);		
	}
	
}
